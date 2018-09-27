import {token, production, productionText} from "./Types"
import {FiniteStateAutomata} from "./FiniteStateAutomata"
import {Lexer} from "./Lexer"

export class item {

	LHS: string
	rule: production
	start: number
	position: number
	prev: null | item
	complete: null | item

	constructor (LHS: string, rule: production, start: number, position: number) {
		this.LHS = LHS
		this.rule = rule
		this.start = start
		this.position = position
		this.prev = null
		this.complete = null
	}

	clone(): item {
		let newItem: item = new item(this.LHS, this.rule, this.start, this.position)
		newItem.prev = this.prev
		newItem.complete = this.complete
		return newItem
	}

	nextPosition(): any {
		if (this.position < this.rule.RHS.length)
			return this.rule.RHS[this.position]
		else
			return 0
	}

	end(): boolean {
		return this.position == this.rule.RHS.length
	}
}

export class node {
	LHS: string
	rule: production
	children: Array<node>

	constructor (LHS: string, rule: production, children: Array<node>) {
		this.LHS = LHS
		this.rule = rule
		this.children = children
	}
}

export interface ParseInfo {
	lexemes: Array<string>,
	derivations: Array<node>
}

export class CFG {
	
	terminalSymbols: Set<token>
	nonTerminalSymbols: Set<string>
	S: string
	productions: Map<string, Set<production> >
	name: string
	private FSA: FiniteStateAutomata

	constructor (terminalSymbols: Set<token>, nonTerminalSymbols: Set<string>, initialSymbol: string, FSA: FiniteStateAutomata) {
		this.terminalSymbols = new Set(terminalSymbols)
		this.nonTerminalSymbols = new Set(nonTerminalSymbols)
		this.productions = new Map()
		this.S = initialSymbol
		this.name = ""
		this.FSA = FSA
	}

	getName(): string {
        return this.name
    }

    setName(name: string): void {
        this.name = name
    }

    private addProductionIfNotExist(LHS: string): void {
    	if (!this.productions.has(LHS))
    		this.productions.set(LHS, new Set())
    }

    isTerminal(token: any): boolean {
    	return this.terminalSymbols.has(token)
    }

    isNonTerminal(LHS: any): boolean {
    	return this.nonTerminalSymbols.has(LHS)
    }

    addRule(LHS: string, RHS: productionText, callback: (args: Array<any>)=>any): boolean {
    	if (!this.isNonTerminal(LHS)) return false
    	this.addProductionIfNotExist(LHS)
    	this.productions.get(LHS)!.add({
    		RHS: RHS,
    		callback: callback
    	})
    	return true
    }

    private hashItem(item: item): string {
    	return item.LHS + ";" + item.rule.RHS.join(",") + ";" + item.start.toString() + ";" + item.position.toString()
    }

    private existItem(items: Array<item>, item: item): boolean {
    	for(let i = 0; i < items.length; ++i){
    		if(this.hashItem(items[i]) == this.hashItem(item)) return true
    	}
	    return false
    }

    private createTree(root: item|null): Array<node> {
		if(root == null) return []
    	let nodes: Array<node> = []
    	let pending: Array<item|null> = []
    	pending.push(root.complete)

    	let prev: item|null = root.prev
    	while (prev != null && prev.position > 0){
    		pending.push(prev);
    		prev = prev.prev
    	}

    	while (pending.length > 0) {
    		if(pending[pending.length - 1] != null)
    			nodes = [...nodes, ...this.createTree(pending[pending.length - 1])]
    		pending.pop()
    	}

    	if (root.end())
    		return [new node(root.LHS, root.rule, nodes)]
    	else
    		return nodes
    }

    parseString (testString: string): ParseInfo {
    	let lexer: Lexer = new Lexer(this.FSA, testString)
		let dp: Array<Array<item> > = []
		dp[0] = []
		let init: Set<production> = this.productions.get(this.S)!
		init.forEach(rule => dp[0].push(new item(this.S, rule, 0, 0)))
		let n: number = 0
		let prevIndex = 0
		let lexemes: Array<string> = []

		while (true) {
			let currentToken: token = lexer.getNextToken()
			if (currentToken == token.Error) lexer.advance()

			let change: boolean = true
			while (change) {
				change = false
				if(typeof dp[n] == "undefined") dp[n] = []
				for(let j = 0; j < dp[n].length; ++j){
					let currItem: item = dp[n][j]
					let next: any = currItem.nextPosition()
					if(currItem.end()){
						dp[currItem.start].forEach(item => {
							if(item.nextPosition() == currItem.LHS){
								let newItem: item = item.clone()
								++newItem.position
								newItem.prev = item.clone()
								newItem.complete = currItem.clone()
								if(!this.existItem(dp[n], newItem)){
									dp[n].push(newItem)
									change = true
								}
							}
						})
					}else if(this.isTerminal(next)){
						if(next == currentToken){
							let newItem: item = currItem.clone()
							++newItem.position
							if(typeof dp[n + 1] == "undefined") dp[n + 1] = []
							if(!this.existItem(dp[n + 1], newItem)){
								dp[n + 1].push(newItem)
								change = true
							}
						}
					}else{
						this.productions.get(next)!.forEach(rule => {
							let newItem: item = new item(next, rule, n, 0)
							if(!this.existItem(dp[n], newItem)){
								dp[n].push(newItem)
								change = true
							}
						})
					}
				}
			}

			if (currentToken == token.EOF) break
			lexemes.push(testString.substring(prevIndex, lexer.position));
			prevIndex = lexer.position
			n++
		}

		let nodes: Array<node> = []

		dp[n].forEach(currItem =>{
			if(currItem.end() && currItem.start == 0 && currItem.LHS == this.S)
				nodes = [...nodes, ...this.createTree(currItem)]
		})

		return {
			lexemes: lexemes,
			derivations: nodes
		}
	}

	executeActions(info: ParseInfo, index: number = 0): any {
		let posTerminal: number = 0
		let self = this;
		let lexemes: Array<string> = info.lexemes
		let dfs: (current: node) => any = function(current: node): any{
		    let posChild: number = 0
		    let args: Array<string> = []
		    current.rule.RHS.forEach(c => {
		        if(self.isNonTerminal(c))
		            args.push(dfs(current.children[posChild++]));
		        else
		            args.push(lexemes[posTerminal++])
		    })
		    if(current.rule.callback)
		        return current.rule.callback(args);
		    return null
		}
		if(info.derivations[index])
			return dfs(info.derivations[index])
		return null
	}

}