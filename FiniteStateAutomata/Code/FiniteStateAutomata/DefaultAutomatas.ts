import {FiniteStateAutomata} from "./FiniteStateAutomata"
import {token} from "./Types"

const plusSign = FiniteStateAutomata.basicFSA('+');
plusSign.setName("Plus sign");
plusSign.setFinalToken(token.PlusSign);

const minusSign = FiniteStateAutomata.basicFSA('-');
minusSign.setName("Minus sign");
minusSign.setFinalToken(token.MinusSign);

const multSign = FiniteStateAutomata.basicFSA('*');
multSign.setName("Multiplication sign");
multSign.setFinalToken(token.MultiplicationSign);

const divSign = FiniteStateAutomata.basicFSA('/');
divSign.setName("Division sign");
divSign.setFinalToken(token.DivisionSign);

const openParenthesis = FiniteStateAutomata.basicFSA('(');
openParenthesis.setName("Opening parenthesis");
openParenthesis.setFinalToken(token.OpenParenthesis);

const closeParenthesis = FiniteStateAutomata.basicFSA(')');
closeParenthesis.setName("Closing parenthesis");
closeParenthesis.setFinalToken(token.CloseParenthesis);

const integer = FiniteStateAutomata.basicFSA('d');
integer.positiveClosure();
integer.setName("Integer");

const decimal = integer.clone();
decimal.concat(FiniteStateAutomata.basicFSA('.'));
decimal.concat(integer.clone());
decimal.setName("Decimal");

const exponent = FiniteStateAutomata.basicFSA('E').join(FiniteStateAutomata.basicFSA('e'));
exponent.concat(plusSign.clone().join(minusSign.clone()).optionalClosure().concat(integer.clone()));

const float = decimal.clone().concat(exponent.clone());
float.setName("Float");

const number = FiniteStateAutomata.superJoin([integer.clone(), decimal.clone(), float.clone()]);
number.setName("Number");
number.setFinalToken(token.Number);

const arithmetic = FiniteStateAutomata.superJoin(
    [   
        plusSign.clone(), 
        minusSign.clone(), 
        multSign.clone(),
        divSign.clone(),
        openParenthesis.clone(),
        closeParenthesis.clone(),
        number.clone()
    ]
);

arithmetic.setName("Arithmetic expressions")


const DefaultAutomatas: Array<FiniteStateAutomata> = [plusSign, minusSign, multSign, divSign, openParenthesis, closeParenthesis,
    integer, decimal, exponent, float, number, arithmetic
]

export default DefaultAutomatas