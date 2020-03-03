export function sizer () {
  const cards = document.querySelectorAll('.card')
  const contents = document.querySelectorAll('.content')
  const dayOff = document.querySelectorAll('.day-off')
  setHeight(cards, getMaxHeight(cards))
  setHeight(dayOff, getMaxHeight(contents))
}

function getMaxHeight (elements) {
  let maxHeight = 0

  for (const element of elements) {
    const height = element.offsetHeight
    if (height > maxHeight) {
      maxHeight = height
    }
  }

  return maxHeight
}

function setHeight (elements, height) {
  for (const element of elements) {
    element.style.height = `${height}px`
  }
}
