import {FiniteStateAutomata, AutomataJSON} from "./FiniteStateAutomata"
import {Lexer} from "./Lexer"
import { tokenID, TokenError, TokenEOF, TokenDefault } from "./Token";

export type productionText = Array<any>
export type nonTerminal = string
export interface production {
	RHS: productionText,
	callback: (args: Array<any>)=>any
}

export class item {

	LHS: nonTerminal
	rule: production
	start: number
	position: number
	prev: null | item
	complete: null | item

	constructor (LHS: nonTerminal, rule: production, start: number, position: number) {
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
	LHS: nonTerminal
	rule: production
	children: Array<node>

	constructor (LHS: nonTerminal, rule: production, children: Array<node>) {
		this.LHS = LHS
		this.rule = rule
		this.children = children
	}
}

export interface ParseInfo {
	lexemes: Array<string>,
	derivations: Array<node>
}

export interface ProductionJSON {
	RHS: productionText,
	callback: string
}

export interface CFGJSON {
	name: string
	S: nonTerminal
	terminalSymbols: Array<tokenID>
	nonTerminalSymbols: Array<nonTerminal>
	productions: Array<[nonTerminal, Array<ProductionJSON>]>
	FSA: AutomataJSON
}

export class CFG {
	
	terminalSymbols: Set<tokenID>
	nonTerminalSymbols: Set<nonTerminal>
	S: nonTerminal
	productions: Map<nonTerminal, Array<production> >
	first: Map<nonTerminal, Set<tokenID> >
	follow: Map<nonTerminal, Set<tokenID> >
	name: string
	private FSA: FiniteStateAutomata

	constructor (terminalSymbols: Set<tokenID>, nonTerminalSymbols: Set<nonTerminal>, initialSymbol: nonTerminal, FSA: FiniteStateAutomata) {
		this.terminalSymbols = new Set(terminalSymbols)
		this.nonTerminalSymbols = new Set(nonTerminalSymbols)
		this.first = new Map()
		this.follow = new Map()
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

    private addProductionIfNotExist(LHS: nonTerminal): void {
    	if (!this.productions.has(LHS)){
			this.productions.set(LHS, [])
			this.first.set(LHS, new Set())
			this.follow.set(LHS, new Set())
		}
    }

    isTerminal(token: any): boolean {
    	return this.terminalSymbols.has(token)
    }

    isNonTerminal(LHS: any): boolean {
    	return this.nonTerminalSymbols.has(LHS)
    }

    addRule(LHS: nonTerminal, RHS: productionText, callback: (args: Array<any>)=>any): boolean {
    	if (!this.isNonTerminal(LHS)) return false
    	this.addProductionIfNotExist(LHS)
    	this.productions.get(LHS)!.push({
    		RHS: RHS,
    		callback: callback
    	})
    	return true
	}

	removeLeftRecursion(): CFG {
		let goodRules: Set<nonTerminal> = new Set()
		let badRules: Set<nonTerminal> = new Set()
		this.productions.forEach( (rules, LHS) => {
			rules.forEach(production => {
				if(production.RHS.length > 0 && production.RHS[0] == LHS)
					badRules.add(LHS)
			})
		})
		this.nonTerminalSymbols.forEach(LHS => {
			if(!badRules.has(LHS))
				goodRules.add(LHS)
		})

		let result: CFG = new CFG(new Set(this.terminalSymbols), new Set(this.nonTerminalSymbols), this.S, this.FSA)

		badRules.forEach(LHS => {
			let productions: Array<production> = this.productions.get(LHS)!
			let newLHS = LHS + "'"
			result.nonTerminalSymbols.add(newLHS)
			productions.forEach(production => {
				let RHS: productionText = production.RHS
				if(RHS.length > 0 && RHS[0] == LHS){
					let newRHS: Array<any> = [...RHS]
					newRHS.splice(0, 1)
					newRHS.push(newLHS)
					result.addRule(newLHS, newRHS, function(){})
				}else{
					let newRHS: Array<any> = [...RHS]
					newRHS.push(newLHS)
					result.addRule(LHS, newRHS, function(){})
				}
			})
			result.addRule(newLHS, [], function(){})
		})

		goodRules.forEach(LHS => {
			let productions: Array<production> = this.productions.get(LHS)!
			productions.forEach(production => {
				result.addRule(LHS, [...production.RHS], production.callback)
			})
		})

		return result
	}

	private hashSet(statesIDs: Set<tokenID>): string {
        return Array.from(statesIDs).sort((a, b) => a - b).join(',')
	}
	
	private nullable(LHS: nonTerminal): boolean {
		return this.first.get(LHS)!.has(TokenDefault)
	}
	
	calculateFirstSets(): void {
		let change: boolean = true
		while(change){
			change = false
			this.productions.forEach( (rules, LHS) => {
				let newSet: Set<tokenID> = new Set(this.first.get(LHS)!)
				rules.forEach(production => {
					let i = 0
					for(; i < production.RHS.length; ++i){
						let c = production.RHS[i]
						if(this.isTerminal(c)){
							newSet.add(c)
							break
						}
						let firstOfC: Set<tokenID> = new Set(this.first.get(c)!)
						firstOfC.delete(TokenDefault)
						newSet = new Set([...newSet, ...firstOfC])
						if(!this.nullable(c)) break
					}

					if(i == production.RHS.length)
						newSet.add(TokenDefault)
				})

				change = change || (this.hashSet(newSet) != this.hashSet(this.first.get(LHS)!))
				this.first.set(LHS, newSet)
			})
		}
	}

	calculateFollowSets(): void {
		this.follow.get(this.S)!.add(TokenEOF)

		this.productions.forEach( (rules, _) => {
			rules.forEach(production => {
				for(let i = 0; i < production.RHS.length; ++i){
					let c = production.RHS[i]
					if(this.isNonTerminal(c)){
						for(let j = i+1; j < production.RHS.length; ++j){
							let d = production.RHS[j]
							if(this.isTerminal(d)){
								this.follow.get(c)!.add(d)
								break
							}
							this.follow.set(c, new Set([...this.follow.get(c)!, ...this.first.get(d)!]))
							if(!this.nullable(d)) break
						}
					}
				}
			})
		})

		let change: boolean = true
		while(change){
			change = false
			this.productions.forEach( (rules, LHS) => {
				rules.forEach(production => {
					for(let i = production.RHS.length-1; i >= 0; --i){
						let c = production.RHS[i]
						if(this.isTerminal(c)) break
						let newSet: Set<tokenID> = new Set([...this.follow.get(c)!, ...this.follow.get(LHS)!])
						change = change || (this.hashSet(newSet) != this.hashSet(this.follow.get(c)!))
						this.follow.set(c, newSet)
						if(!this.nullable(c)) break
					}
				})
			})
		}

		this.follow.forEach(followSet => followSet.delete(TokenDefault))
	}

	firstRHS(RHS: productionText): Set<tokenID> {
		let result: Set<tokenID> = new Set()
		let i = 0
		for(; i < RHS.length; ++i){
			let c = RHS[i]
			if(this.isTerminal(c)){
				result.add(c)
				break
			}
			let firstOfC: Set<tokenID> = this.first.get(c)!
			let nullable: boolean = firstOfC.has(TokenDefault)
			firstOfC.delete(TokenDefault)
			result = new Set([...result, ...firstOfC])
			if(!nullable) break
		}
		if(i == RHS.length)
			result.add(TokenDefault)
		return result
	}

	//Begin of Earley parser
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
		let init: Array<production> = this.productions.get(this.S)!
		init.forEach(rule => dp[0].push(new item(this.S, rule, 0, 0)))
		let n: number = 0
		let prevIndex = 0
		let lexemes: Array<string> = []

		while (true) {
			let currentToken: tokenID = lexer.getNextToken()
			if (currentToken == TokenError) lexer.advance()

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

			if (currentToken == TokenEOF) break
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
	//End of Earley parser

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

	serialize(): CFGJSON {
		const JSONCFG: CFGJSON = {
			name: this.name,
			S: this.S,
			terminalSymbols: Array.from(this.terminalSymbols),
			nonTerminalSymbols: Array.from(this.nonTerminalSymbols),
			FSA: this.FSA.serialize(),
			productions: Array.from(this.productions).map(production => [production[0], production[1].map(rule => {return {RHS: rule.RHS, callback: rule.callback.toString()}})] as [nonTerminal, Array<ProductionJSON>])
		}

		return JSONCFG
	}

	static deserialize(JSONData: CFGJSON) : CFG | null {
		try {
			const result = new CFG(new Set(JSONData.terminalSymbols), new Set(JSONData.nonTerminalSymbols), JSONData.S, FiniteStateAutomata.deserialize(JSONData.FSA)!)
			result.setName(JSONData.name)
			JSONData.productions.forEach(productionData => {
				const LHS: nonTerminal = productionData[0]
				const rules: Array<ProductionJSON> = productionData[1]
				rules.forEach(JSONrule => {
					result.addRule(LHS, JSONrule.RHS, new Function("return " + JSONrule.callback)())
				})
			})

			return result
		} catch(e) {
            return null
        }
	}

}