class Stack{
    values = []
    push(v){
        this.values.push(v)
    }
    size(){
        return this.values.length
    }
    top(){
        return this.values[this.size()-1]
    }
    pop(){
        return this.values.pop()
    }
    isEmpty(){
        return this.values.length <= 0
    }
}

class Walker{
    value
    index
    setup(infixada){
        this.value = infixada
        this.index = -1
    }
    current(){
        return this.value[this.index]
    }
    hasNext(){
        return this.value.length > (this.index + 1)
    }
    next(){
        this.index++
        return this.current()
    }
}

class Operator{
    parenthesisCounter
    constructor(value, priority){
        this.value = value
        this.priority = priority
    }
    isIt(c){
        return this.value == c
    }
    hasPriorityBiggerThanConsideringADrawAsItBigger(op){
        return this.priority >= op.priority
    }
    copyWith(parenthesisCounter){
        let op = new Operator(this.value, this.priority)
        op.parenthesisCounter = parenthesisCounter
        return op
    }
}
function operator(v, p){
    return new Operator(v, p)
}
const operators = [
    operator("+", 1),
    operator("-", 1),
    operator("*", 2),
    operator("/", 2),
    operator("^", 3)
]
function getOperator(o, parenthesisCounter){
    for(let op in operators){
        if(operators[op].isIt(o)){
            return operators[op].copyWith(parenthesisCounter)
        }
    }
}
const numbers = ['0','1','2','3','4','5','6','7','8','9']

class Processor{
    constructor(){
        this.walker = new Walker()
    }

    isOperator(c){
        for(let p in operators){
            if(operators[p].isIt(c)){
                return true
            }
        }
        return false
    }

    isSpace(c){
        return c == " "
    }

    isNumber(c){
        return numbers.includes(c)
    }

    custom(c){
        switch(c){
            case '(':
                return 1
            case ')':
                return 2
        }
        return -6
    }

    process(infixada){
        this.walker.setup(infixada)

        let res = ""
        let state = {
            currentNumber: "",
            lastWasSpace: false,
            lastWasOperator: true,
            readingNumber: false,
            parenthesisCounter: 0,
            operatorsStack: new Stack()
        }
        let r = ""
        while(this.walker.hasNext()){
            r = this.walker.next()
            if(this.isSpace(r)){
                state.lastWasSpace = true
                continue
            }else{
                if(this.isNumber(r)){
                    if(state.readingNumber){
                        if(state.lastWasSpace){
                            return -2
                        }
                        state.currentNumber += r
                    }else{
                        state.currentNumber = r
                    }
                    state.readingNumber = true
                    state.lastWasOperator = false
                }else{
                    if(this.isOperator(r)){
                        res += " " + state.currentNumber
                        state.currentNumber = ""
                        if(state.lastWasOperator){
                            return -5
                        }
                        state.lastWasOperator = true
                        let opLogicRes = this.#operatorLogic(state, r)
                        if(opLogicRes == -1){
                            return -1
                        }
                        res += " " + opLogicRes
                    }else{
                        let custom = this.custom(r)
                        if(custom == -1){
                            return -1
                        }
                        switch(custom){
                            case 1:
                                state.parenthesisCounter++
                                break
                            case 2:
                                state.parenthesisCounter--
                                if(state.parenthesisCounter < 0){
                                    return -3
                                }
                                if(state.readingNumber){
                                    res += " " + state.currentNumber
                                    state.currentNumber = ""
                                    state.readingNumber = false
                                }
                                if(!state.operatorsStack.isEmpty()){
                                    while(!state.operatorsStack.isEmpty() && state.operatorsStack.top().parenthesisCounter > state.parenthesisCounter){
                                        res += " " + state.operatorsStack.pop().value
                                    }
                                }
                                break
                            default:
                                return custom
                        }
                    }
                    state.readingNumber = false
                }
                state.lastWasSpace = false
            }
        }
        if(state.parenthesisCounter > 0){
            return -4
        }
        if(state.readingNumber){
            res += " " + state.currentNumber
            state.readingNumber = false
        }
        while(!state.operatorsStack.isEmpty()){
            res += " " + state.operatorsStack.pop().value
        }
        return res
    }
    #operatorLogic(state, r){
        let op = getOperator(r, state.parenthesisCounter)
        if(!state.operatorsStack.isEmpty()){
            let res = ""
            if(state.operatorsStack.top().hasPriorityBiggerThanConsideringADrawAsItBigger(op)){
                while(!state.operatorsStack.isEmpty() && state.operatorsStack.top().parenthesisCounter >= op.parenthesisCounter){
                    res += " " + state.operatorsStack.pop().value
                }
            }
            state.operatorsStack.push(op)
            return res
        }else{
            state.operatorsStack.push(op)
        }
        return ""
    }
}

// Por Luisz576