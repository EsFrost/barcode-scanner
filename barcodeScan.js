const input = document.getElementById('input')
const productResult = document.getElementById('productResult')
const sales = document.getElementById('sales')
const clearCache = document.getElementById('clearCache')
const returnBtn = document.getElementById('return')
const search = document.getElementById('search')
const colorMode = document.getElementById('colorMode')
const subTotal = document.getElementById('subtotal')
const modalBtn = document.getElementById('modal-btn')
let newDiv = document.createElement('div')
let subTotalPrice = 0.0
let rowsCopy, total
let cached = []
let buttonFlag = false

if (localStorage.getItem('colorMode') === null) {
	localStorage.setItem('colorMode', 'dark')
	colorMode.textContent = 'Light mode'
}
else if (localStorage.getItem('colorMode') === 'dark') {
	colorMode.textContent = 'Light mode'
	
}
else {
	colorMode.textContent = 'Dark mode'
	document.body.style.backgroundColor = 'white'
	document.body.style.color = 'black'
	document.getElementsByTagName('label')[0].style.color = 'white'
}

subTotal.addEventListener('click', () => {
	
	if (cached.length !== 0) {
		cached[cached.length-1][3] = true
		if (JSON.parse(localStorage.getItem('cachedPrice')) === null || JSON.parse(localStorage.getItem('cachedPrice')).length === 0 || JSON.parse(localStorage.getItem('cachedPrice')) === undefined) {
			localStorage.setItem('cachedPrice', JSON.stringify(cached))
		}
		else {
			let temp = JSON.parse(localStorage.getItem('cachedPrice'))
			temp = [...temp, ...cached]
			localStorage.setItem('cachedPrice', JSON.stringify(temp))
		}

		modalBtn.parentElement.parentElement.parentElement.style.display = 'flex'

		cached.map((item) => {
			subTotalPrice = subTotalPrice + item[2]
			const resDiv = document.createElement('div')
			const resSpan1 = document.createElement('span')
			const resSpan2 = document.createElement('span')

			resDiv.classList.add('result-div')
			resSpan1.classList.add('text-lg', 'productName')
			resSpan2.classList.add('text-lg', 'productPrice')

			resSpan1.textContent = `${item[1]} :`
			resSpan2.textContent = `${item[2]} €`

			resDiv.appendChild(resSpan1)
			resDiv.appendChild(resSpan2)

			document.getElementById('modal-products').appendChild(resDiv)

		})
		subTotalPrice = parseFloat(subTotalPrice.toString().replace(',', '.'))
		document.getElementById('modal-subtotal').textContent = `Σύνολο: ${subTotalPrice.toFixed(1)} €`

		modalBtn.addEventListener('click', () => {
			modalBtn.parentElement.parentElement.parentElement.style.display = 'none'
			location.reload()
		})

	}
	

	cached = []
	subTotalPrice = 0.0
})


colorMode.addEventListener('click', () => {
	if (localStorage.getItem('colorMode') === 'dark') {
		localStorage.setItem('colorMode', 'light')
		location.reload()
	}
	else if (localStorage.getItem('colorMode') === 'light') {
		localStorage.setItem('colorMode', 'dark')
		location.reload()
	}
})


const productElement = (name, price, idVal, falseVal) => {
	const resDiv = document.createElement('div')
	const resSpan1 = document.createElement('span')
	const resSpan2 = document.createElement('span')
	const resButton = document.createElement('div')
	const resHr = document.createElement('hr')

	resDiv.classList.add('result-div')
	resSpan1.classList.add('text-lg', 'productName')
	resSpan2.classList.add('text-lg', 'productPrice')
	resButton.classList.add('del-button')

	resDiv.setAttribute('id', idVal)

	resSpan1.textContent = `${name} :`
	resSpan2.textContent = `${price} €`
	resButton.textContent = 'X'

	resDiv.appendChild(resSpan1)
	resDiv.appendChild(resSpan2)
	resDiv.appendChild(resButton)

	if (falseVal === true) {
		resDiv.appendChild(resHr)
	}
	productResult.appendChild(resDiv)

	resButton.addEventListener('click', (e) => {
		resButton.parentElement.remove()
		let finalArr = []
		if (cached.length !== 0) {
			cached.map((item) => {
				if (item[0] !== resButton.parentElement.getAttribute('id')) {
					finalArr.push(item)
				}
			})
			cached = finalArr
			if (cached.length === 0) {
				location.reload()
			}

			finalArr = []
		}

		if (JSON.parse(localStorage.getItem('cachedPrice')).length !== 0) {
			JSON.parse(localStorage.getItem('cachedPrice')).map((item) => {
				if (item[0] !== resButton.parentElement.getAttribute('id')) {
					finalArr.push(item)
				}
			})

			localStorage.setItem('cachedPrice', JSON.stringify(finalArr))

			finalArr = []
		}
	})
}

clearCache.addEventListener('click', () => {
	localStorage.removeItem('cachedPrice')
	total = 0
	cache = []
	location.reload()
})

sales.addEventListener('click', () => {
	if (document.getElementById('subTotalPrint')) {
		document.getElementById('subTotalPrint').style['position'] = 'absolute'
		document.getElementById('subTotalPrint').style['left'] = '-10000px'
	}

	if (JSON.parse(localStorage.getItem('cachedPrice')) !== null && JSON.parse(localStorage.getItem('cachedPrice')).length !== 0) {
		returnBtn.style['position'] = 'inherit'
		document.getElementById('search').style['position'] = 'absolute'
		document.getElementById('search').style['left'] = '-10000px'
		document.getElementsByClassName('button-wrap')[0].style['positon'] = 'absolute'
		document.getElementsByClassName('button-wrap')[0].style['left'] = '-10000px'

		document.getElementById('productResult').textContent = ''
		document.getElementById('productResult').style['position'] = 'absolute'
		document.getElementById('productResult').style['top'] = '3rem'

		subTotal.style['position'] = 'absolute'
		subTotal.style['left'] = '-10000px'

		total = 0

		JSON.parse(localStorage.getItem('cachedPrice')).map((item) => {
			productElement(item[1], item[2], item[0], item[3])
			let t = parseFloat(item[2].toString().replace(',', '.'))
			if (total === undefined || total === '') {
				total = t
			}
			else {
				total += t
			}
		})
		const totalDiv = document.createElement('div')
		totalDiv.setAttribute('id', 'total')
		totalDiv.textContent = `Σύνολο: ${total.toFixed(1)} €`

		productResult.appendChild(totalDiv)
	}
	else {
		document.getElementById('warning').textContent = 'Δεν έχει γίνει κάποια πώληση!'
		document.getElementById('alert').style.display = 'block'
		total = 0
	}
})

returnBtn.addEventListener('click', () => {
	returnBtn.style['position'] = 'absolute'
	document.getElementById('search').style['position'] = 'inherit'
	document.getElementsByClassName('button-wrap')[0].style['positon'] = 'relative'
	document.getElementsByClassName('button-wrap')[0].style['left'] = '0'
	document.getElementById('productResult').textContent = ''
	document.getElementById('productResult').style['position'] = 'inherit'
	subTotal.style['position'] = 'inherit'

	location.reload()

})

input.addEventListener('change', () => {
	readXlsxFile(input.files[0]).then((rows) => {
		rowsCopy = [...rows]
		localStorage.setItem('arrayCopy', JSON.stringify(rowsCopy))
	})
})

input.addEventListener('click', (e) => {
	document.getElementById('warning')?document.getElementById('warning').remove():''
})


search.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {

		if (localStorage.getItem('arrayCopy')) {
			const tempCached = localStorage.getItem('arrayCopy')
			const result = JSON.parse(tempCached).filter(product => {
				if (product[0] !== null && search.value === product[0].toString()) {
					return product
				}
			})


			if (result.length !== 0) {
				let id = Math.random().toString(16).substr(2, 12)

				const test = [id, result[0][2], result[0][1], false]
				if (cached.length !== 0 && cached[cached.length-1][3] === true) {
					cached = []
					cached.push(test)
				}
				else {
					cached.push(test)
				}
				

				productElement(result[0][2], result[0][1], id, false)
			}
		}
		else {
			document.getElementById('warning').textContent = 'Δεν έχει επιλεγεί αρχείο xlxs!'
			document.getElementById('alert').style.display = 'block'
		}

		search.value = ''
	}
})
