const { combineRgb } = require('@companion-module/base')
const { resolveCueIdFromOptions, getCueButtonColors, isCueIdle, getCueById } = require('./cueUtils.js')

function buildCueColorStyle(cue) {
	const colors = getCueButtonColors(cue)
	return {
		color: combineRgb(colors.color.r, colors.color.g, colors.color.b),
		bgcolor: combineRgb(colors.bgcolor.r, colors.bgcolor.g, colors.bgcolor.b),
	}
}

function buildCueTargetFeedbackOptions() {
	return [
		{
			type: 'textinput',
			label: 'Cue Number (1-based)',
			id: 'cueNumber',
			default: '',
			tooltip: 'Grid position in layout order.',
		},
		{
			type: 'textinput',
			label: 'Cue ID (optional override)',
			id: 'cueId',
			default: '',
		},
	]
}

function resolveFeedbackCueId(self, options) {
	if (options && options.cueId) {
		const cueId = String(options.cueId).trim()
		if (cueId && self.cues && self.cues.find((cue) => cue.id === cueId)) {
			return cueId
		}
	}
	return resolveCueIdFromOptions(self, options)
}

function getFeedbackDefinitions(self) {
	const cueTargetOptions = buildCueTargetFeedbackOptions()

	return {
		cue_app_color: {
			type: 'advanced',
			name: 'Cue App Button Color',
			description: 'Matches the cue button color from AV Cueboard when idle.',
			options: cueTargetOptions,
			callback: (feedback) => {
				const cueId = resolveFeedbackCueId(self, feedback.options)
				if (!cueId || !isCueIdle(self, cueId)) return {}
				const cue = getCueById(self, cueId)
				if (!cue) return {}
				return buildCueColorStyle(cue)
			},
		},
		cue_is_playing: {
			type: 'boolean',
			name: 'Cue is Playing',
			description: 'If the specified cue is currently playing.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(0, 255, 0),
			},
			options: cueTargetOptions,
			callback: (feedback) => {
				const cueId = resolveFeedbackCueId(self, feedback.options)
				return !!cueId && self.cuePlayStates[cueId] === 'playing'
			},
		},
		cue_is_paused: {
			type: 'boolean',
			name: 'Cue is Paused',
			description: 'If the specified cue is currently paused.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 165, 0),
			},
			options: cueTargetOptions,
			callback: (feedback) => {
				const cueId = resolveFeedbackCueId(self, feedback.options)
				return !!cueId && self.cuePlayStates[cueId] === 'paused'
			},
		},
		cue_is_stopped: {
			type: 'boolean',
			name: 'Cue is Stopped / Inactive',
			description: 'If the specified cue is currently stopped or not active.',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			options: cueTargetOptions,
			callback: (feedback) => {
				const cueId = resolveFeedbackCueId(self, feedback.options)
				if (!cueId) return true
				const status = self.cuePlayStates[cueId]
				return status === 'stopped' || status === 'error' || !status
			},
		},
		cue_is_fading: {
			type: 'boolean',
			name: 'Cue is Fading',
			description: 'If the specified cue is currently fading in or fading out.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 165, 0),
			},
			options: cueTargetOptions,
			callback: (feedback) => {
				const cueId = resolveFeedbackCueId(self, feedback.options)
				return !!cueId && self.cuePlayStates[cueId] === 'fading'
			},
		},
		cue_is_fading_in: {
			type: 'boolean',
			name: 'Cue is Fading In',
			description: 'If the specified cue is currently fading in.',
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 165, 0),
			},
			options: cueTargetOptions,
			callback: (feedback) => {
				const cueId = resolveFeedbackCueId(self, feedback.options)
				const fadeState = cueId ? self.cueFadeStates[cueId] : null
				return !!cueId && self.cuePlayStates[cueId] === 'fading' && fadeState && fadeState.isFadingIn
			},
		},
		cue_is_fading_out: {
			type: 'boolean',
			name: 'Cue is Fading Out',
			description: 'If the specified cue is currently fading out.',
			defaultStyle: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 100, 0),
			},
			options: cueTargetOptions,
			callback: (feedback) => {
				const cueId = resolveFeedbackCueId(self, feedback.options)
				const fadeState = cueId ? self.cueFadeStates[cueId] : null
				return !!cueId && self.cuePlayStates[cueId] === 'fading' && fadeState && fadeState.isFadingOut
			},
		},
	}
}

module.exports = { getFeedbackDefinitions }
