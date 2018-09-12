import {stateID, token, TokenInfo} from "./Types"
import {FiniteStateAutomata} from "./FiniteStateAutomata"

export class Lexer {
    private FSA: FiniteStateAutomata
    public testString: string
    private position: number

    constructor(FSA: FiniteStateAutomata, testString: string) {
        this.testString = testString
        this.position = 0
        this.FSA = FSA
    }

    reset(): void {
        this.position = 0
    }

    advance(): boolean {
        if (this.position != this.testString.length) this.position++

        return this.position < this.testString.length
    }

    private isFinalState(states: Set<stateID>): boolean {
        let finalState: boolean = false
        states.forEach (
            id => finalState = finalState || this.FSA.isFinalState(id)
        )
        return finalState
    }

    private getToken(states: Set<stateID>): token {
        let token: token = -1
        states.forEach (
            id => {
                if (this.FSA.isFinalState(id)) token = this.FSA.states.get(id)!.token
            }
        )
        return token
    }

    getNextToken(): TokenInfo {
        if (this.position == this.testString.length) 
        return {
            token: 0, 
            position: this.testString.length
        }

        let currentState: Set<stateID> = this.FSA.epsilonClosure(this.FSA.initialState)
        let lastMatchedState: Set<stateID> = new Set()
        let endMatchPosition: number = this.position

        while (this.position <= this.testString.length) {
            if (this.isFinalState(currentState)) {
                lastMatchedState = currentState
                endMatchPosition = this.position
            }
            
            let toState: Set<stateID> = new Set()
            if (this.position != this.testString.length)
                toState = this.FSA.goToSet(currentState, this.testString[this.position++])
            
            if (toState.size > 0) 
                currentState = toState
            else {
                this.position = endMatchPosition
                return {
                    token: this.getToken(lastMatchedState), 
                    position: endMatchPosition
                }
            }
        }

        return {
            token: 0, 
            position:this.testString.length
        }
    }

    
}
