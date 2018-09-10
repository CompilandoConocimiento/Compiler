import {token, production} from "./Types"

export class item {

	name: string
	rule: production
	start: number
	position: number
	prev: null | item
	complete: null | item

	constructor (name: string, rule: production, start: number, position: number) {
		this.name = name
		this.rule = rule.slice(0)
		this.start = start
		this.position = position
		this.prev = null
		this.complete = null
	}

	clone(): item {
		let newItem: item = new item(this.name, this.rule, this.start, this.position)
		newItem.prev = this.prev
		newItem.complete = this.complete
		return newItem
	}

	nextPosition(): token|string {
		if (this.position < this.rule.length)
			return this.rule[this.position]
		else
			return 0
	}

	end(): boolean {
		return this.position == this.rule.length
	}
}

export class node {
	name: string
	text: string
	children: Array<node>

	constructor (name: string, text: production, children: Array<node>) {
		this.name = name
		this.text = text.slice(0)
		this.children = children
	}
}

export class CFG {
	
	terminalSymbols: Set<token>
	nonTerminalSymbols: Set<string>
	S: string
	productions: Map<string, Set<production> >
	name: string

	constructor (terminalSymbols: Set<token>, nonTerminalSymbols: Set<string>, initialSymbol: string) {
		this.terminalSymbols = new Set(terminalSymbols)
		this.nonTerminalSymbols = new Set(nonTerminalSymbols)
		this.productions = new Map()
		this.S = initialSymbol
		this.name = ""
	}

	getName(): string {
        return this.name
    }

    setName(name: string): void {
        this.name = name
    }

    private addProductionIfNotExist(name: string): void {
    	if (!this.productions.has(name))
    		this.productions.set(name, new Set())
    }

    isTerminal(token): boolean {
    	return this.terminalSymbols.has(token)
    }

    isNonTerminal(name: string): boolean {
    	return this.nonTerminalSymbols.has(name)
    }

    addRule(name: string, rule: production): boolean {
    	if (!this.isNonTerminal(name)) return false
    	this.addProductionIfNotExist(name)
    	this.productions.get(name)!.add(rule.slice(0))
    	return true
    }

    private hashItem(item: item): string {
    	return item.name + ";" + item.rule.join(",") + ";" + item.start.toString() + ";" + item.position.toString()
    }

    private existItem(items: Array<item>, item: item): boolean {
    	for(let i = 0; i < items.length; ++i){
    		if(this.hashItem(items[i]) == this.hashItem(item)) return true
    	}
	    return false
    }

    private createTree(root: item): Array<node> {
    	let nodes: Array<node> = []
    	let pending: Array<item> = []
    	pending.push(root.complete)

    	let prev: item = root.prev
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
    		return [new node(root.name, root.rule, nodes)]
    	else
    		return nodes
    }

    validateTokens (tokens: Array<token>): boolean {
		let n: number = tokens.length
		let dp: Array<Array<item> > = []
		for(let i = 0; i <= n; ++i) dp[i] = []
		let init: Set<production> = this.productions.get(this.S)!
		init.forEach(rule => dp[0].push(new item(this.S, rule, 0, 0)))

		for (let i = 0; i <= n; ++i) {
			let w: token = 0
			let change: boolean = true
			if (i < n) w = tokens[i]

			while (change) {
				change = false
				for(let j = 0; j < dp[i].length; ++j){
					let currItem: item = dp[i][j]
					let next: token|string = currItem.nextPosition()
					if(currItem.end()){
						dp[currItem.start].forEach(item => {
							if(item.nextPosition() == currItem.name){
								let newItem: item = item.clone()
								++newItem.position
								newItem.prev = item.clone()
								newItem.complete = currItem.clone()
								if(!this.existItem(dp[i], newItem)){
									dp[i].push(newItem)
									change = true
								}
							}
						})
					}else if(this.isTerminal(next)){
						if(next == w){
							let newItem: item = currItem.clone()
							++newItem.position
							if(!this.existItem(dp[i + 1], newItem)){
								dp[i + 1].push(newItem)
								change = true
							}
						}
					}else{
						this.productions.get(next)!.forEach(rule => {
							let newItem: item = new item(next, rule, i, 0)
							if(!this.existItem(dp[i], newItem)){
								dp[i].push(newItem)
								change = true
							}
						})
					}
				}
			}
		}

		let nodes: Array<node> = []

		dp[n].forEach(currItem =>{
			if(currItem.end() && currItem.start == 0 && currItem.name == this.S){
				nodes = [...nodes, ...this.createTree(currItem)]
			}
		})

		return nodes
	}
}