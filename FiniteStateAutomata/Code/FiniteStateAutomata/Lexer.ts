import {stateID, token} from "./Types"
import {FiniteStateAutomata} from "./FiniteStateAutomata"

export class Lexer {
    private FSA: FiniteStateAutomata
    public testString: string
    position: number

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

    getNextToken(): token {
        if (this.position == this.testString.length) return token.EOF

        let currentStates: Set<stateID> = this.FSA.epsilonClosure(this.FSA.initialState)
        let lastMatchedState: Set<stateID> = new Set()
        let endMatchPosition: number = this.position

        while (this.position <= this.testString.length) {
            if (this.isFinalState(currentStates)) {
                lastMatchedState = currentStates
                endMatchPosition = this.position
            }
            
            let toStates: Set<stateID> = new Set()
            if (this.position != this.testString.length)
                toStates = this.FSA.goToSet(currentStates, this.testString[this.position++])
            
            if (toStates.size > 0) 
                currentStates = toStates
            else {
                this.position = endMatchPosition
                return this.getToken(lastMatchedState)
            }
        }

        return token.EOF
    }

    
}
