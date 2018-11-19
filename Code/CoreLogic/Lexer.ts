import {FiniteStateAutomata} from "./FiniteStateAutomata"
import {tokenID, TokenEOF, TokenError} from "./Token"
import {stateID} from "./State"
import { intComp, AVLSet } from "../avl/avl";

export type stateID = number

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

    private isFinalState(states: AVLSet<stateID>): boolean {
        let finalState: boolean = false
        states.forEach (
            id => finalState = finalState || this.FSA.isFinalState(id)
        )
        return finalState
    }

    private getautomataToken(states: AVLSet<stateID>): tokenID {
        let automataToken: tokenID = TokenError
        states.forEach (
            id => {
                if (this.FSA.isFinalState(id)) automataToken = this.FSA.states.get(id)!.token
            }
        )
        return automataToken
    }

    getNextToken(): tokenID {
        if (this.position == this.testString.length) return TokenEOF

        let currentStates: AVLSet<stateID> = this.FSA.epsilonClosure(new AVLSet(intComp, [this.FSA.initialState]))
        let lastMatchedState: AVLSet<stateID> = new AVLSet(intComp)
        let endMatchPosition: number = this.position

        while (this.position <= this.testString.length) {
            if (this.isFinalState(currentStates)) {
                lastMatchedState = currentStates
                endMatchPosition = this.position
            }
            
            let toStates: AVLSet<stateID> = new AVLSet(intComp)
            if (this.position != this.testString.length)
                toStates = this.FSA.goTo(currentStates, this.testString[this.position++])
            
            if (toStates.size() > 0) 
                currentStates = toStates
            else {
                this.position = endMatchPosition
                return this.getautomataToken(lastMatchedState)
            }
        }

        return TokenEOF
    }

    
}
