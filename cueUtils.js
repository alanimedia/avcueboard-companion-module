function orderCuesFromPayload(payload) {
	if (!payload) return []
	if (Array.isArray(payload)) return payload

	const cues = Array.isArray(payload.cues) ? payload.cues : []
	const layout = Array.isArray(payload.layout) ? payload.layout : []

	if (layout.length === 0) return cues

	const cueMap = new Map(cues.map((cue) => [cue.id, cue]))
	const ordered = []
	layout.forEach((entry) => {
		if (entry && entry.type === 'cue' && entry.cueId && cueMap.has(entry.cueId)) {
			ordered.push(cueMap.get(entry.cueId))
			cueMap.delete(entry.cueId)
		}
	})
	cueMap.forEach((cue) => ordered.push(cue))
	return ordered
}

function resolveCueIdFromOptions(self, options) {
	if (!options) return null

	if (options.cueId) {
		const cueId = String(options.cueId).trim()
		if (cueId && self.cues && self.cues.find((cue) => cue.id === cueId)) {
			return cueId
		}
	}

	const raw = options.cueNumber != null ? String(options.cueNumber) : ''
	const index = parseInt(raw, 10) - 1
	if (!Number.isNaN(index) && index >= 0 && self.cues && self.cues[index]) {
		return self.cues[index].id
	}

	return null
}

async function resolveCueId(self, options) {
	try {
		if (options && options.cueId && self.parseVariablesInString) {
			const parsedId = await self.parseVariablesInString(String(options.cueId))
			return resolveCueIdFromOptions(self, { ...options, cueId: parsedId })
		}
		if (options && options.cueNumber != null && self.parseVariablesInString) {
			const parsedNumber = await self.parseVariablesInString(String(options.cueNumber))
			return resolveCueIdFromOptions(self, { ...options, cueNumber: parsedNumber })
		}
		return resolveCueIdFromOptions(self, options)
	} catch (error) {
		self.log('debug', `Failed to resolve cue: ${error}`)
		return null
	}
}

function sendWsAction(self, action, payload) {
	if (!self.ws || self.ws.readyState !== 1) {
		self.log('warn', `${action}: WebSocket is not connected`)
		return false
	}
	self.ws.send(JSON.stringify({ action, payload }))
	return true
}

const DEFAULT_CUE_BUTTON_COLOR = '#3a3a3a'
const TEXT_LUMINANCE_THRESHOLD = 0.5

function normalizeHexColor(color) {
	if (!color || typeof color !== 'string') return null
	let hex = color.trim().toLowerCase()
	if (!hex.startsWith('#')) hex = `#${hex}`
	if (/^#[0-9a-f]{3}$/.test(hex)) {
		hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
	}
	return /^#[0-9a-f]{6}$/.test(hex) ? hex : null
}

function getRelativeLuminance(hex) {
	const normalized = normalizeHexColor(hex)
	if (!normalized) return 0

	const toLinear = (channel) => {
		const c = channel / 255
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
	}

	const r = toLinear(parseInt(normalized.slice(1, 3), 16))
	const g = toLinear(parseInt(normalized.slice(3, 5), 16))
	const b = toLinear(parseInt(normalized.slice(5, 7), 16))

	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function hexToRgb(hexColor) {
	const normalized = normalizeHexColor(hexColor)
	if (!normalized) return null
	return {
		r: parseInt(normalized.slice(1, 3), 16),
		g: parseInt(normalized.slice(3, 5), 16),
		b: parseInt(normalized.slice(5, 7), 16),
	}
}

function getCueButtonColors(cue) {
	const hex = normalizeHexColor(cue && cue.buttonColor) || DEFAULT_CUE_BUTTON_COLOR
	const rgb = hexToRgb(hex)
	const useDarkText = getRelativeLuminance(hex) > TEXT_LUMINANCE_THRESHOLD
	return {
		bgcolor: rgb,
		color: useDarkText ? { r: 26, g: 26, b: 26 } : { r: 224, g: 224, b: 224 },
		hex,
	}
}

function isCueIdle(self, cueId) {
	const status = self.cuePlayStates[cueId]
	return !status || status === 'stopped' || status === 'error'
}

function getCueById(self, cueId) {
	if (!cueId || !self.cues) return null
	return self.cues.find((cue) => cue.id === cueId) || null
}

module.exports = {
	orderCuesFromPayload,
	resolveCueIdFromOptions,
	resolveCueId,
	sendWsAction,
	getCueButtonColors,
	isCueIdle,
	getCueById,
	DEFAULT_CUE_BUTTON_COLOR,
}
