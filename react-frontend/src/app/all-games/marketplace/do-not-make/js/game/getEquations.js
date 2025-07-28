let equations = [
  '13',
  '11+2',
  '11+1+1',
  '9+4',
  '9+2+2',
  '8+5',
  '8+4+1',
  '8+3+2',
  '8+2+2+1',
  '7+6',
  '7+5+1',
  '7+4+2',
  '7+4+1+1',
  '7+3+3',
  '7+2+2+2',
  '6+6+1',
  '6+5+2',
  '6+5+1+1',
  '6+4+3',
  '6+4+2+1',
  '6+4+1+1+1',
  '6+3+2+2',
  '6+2+2+2+1',
  '5+5+3',
  '5+5+2+1',
  '5+5+1+1+1',
  '5+4+4',
  '5+4+2+2',
  '5+3+3+2',
  '5+2+2+2+2',
  '4+4+4+1',
  '4+4+3+2',
  '4+4+2+2+1',
  '4+3+3+3',
  '4+3+2+2+2',
  '4+2+2+2+2+1',
  '3+3+3+2+2',
  '3+2+2+2+2+2',
  '2+2+2+2+2+2+1',

  // plus and multiply
  '7+3*2',
  '6*2+1',
  '5+3*2+2',
  '4*2+5',
  '4*2+4+1',
  '4*2+3+2',
  '4*2+2+2+1',
  '4+3+3*2',
  '5*2+3',
  '3*3+2+2',
  '14-1',
  '15-2',
  '15-1-1',
  '16-2-1',
  '16-1-1-1',
  '17-4',
  '17-2-1-1',
  '17-1-1-1-1',
  '18-5',
  '18-4-1',
  '18-2-1-1-1',
  '19-6',
  '20-7',
  '21-8',
  '22-9',

  // uhm
  '55-42',
  '35-22',
  '3*3+4',
  '45-32',
  '23-5-5',
  '22-5-4',
  '3+5+5',
  '4+4+5',
  '2*5-2+5',
  '23-4-4-2',
  '2+3+4*2'
]

export function getEquations(partitionElements) {
  const result = []
  for (const partition of partitionElements) {
    const elementsCopy = partition.slice()
    for (const equation of equations) {
      let resultItem
      do {
        resultItem = getElements(equation, elementsCopy)
        if (resultItem) {
          result.push(resultItem)
        }
      } while (resultItem)
    }
  }
  return result
}

function getElements(equation, elements) {
  const result = []
  for (const part of equation) {
    let valuesToCheck
    if (part === '*' || part === '+') {
      valuesToCheck = ['+']
    }
    else if (part === '-') {
      valuesToCheck = ['-']
    }
    else if (part === '9' || part === '6') {
      valuesToCheck = [9, 6]
    }
    else {
      valuesToCheck = [Number(part)]
    }
    const elementIndex = elements.findIndex(element => valuesToCheck.includes(element.value))
    if (elementIndex === -1) {
      result.forEach(el => el.useCase = undefined)
      elements.push(...result)
      return undefined
    }
    elements[elementIndex].useCase = part
    result.push(...elements.splice(elementIndex, 1))
  }
  return result
}
