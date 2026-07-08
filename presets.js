const { combineRgb } = require('@companion-module/base')
const { getCueButtonColors } = require('./cueUtils.js')

function buildCueColorStyle(cue) {
	const colors = getCueButtonColors(cue)
	return {
		color: combineRgb(colors.color.r, colors.color.g, colors.color.b),
		bgcolor: combineRgb(colors.bgcolor.r, colors.bgcolor.g, colors.bgcolor.b),
	}
}

function buildCuePlaybackFeedbacks(cue) {
	return [
		{
			feedbackId: 'cue_app_color',
			options: { cueId: cue.id },
		},
		{
			feedbackId: 'cue_is_playing',
			options: { cueId: cue.id },
			style: {
				bgcolor: combineRgb(34, 139, 34),
			},
		},
		{
			feedbackId: 'cue_is_paused',
			options: { cueId: cue.id },
			style: {
				bgcolor: combineRgb(255, 165, 0),
			},
		},
		{
			feedbackId: 'cue_is_fading_in',
			options: { cueId: cue.id },
			style: {
				bgcolor: combineRgb(255, 165, 0),
			},
		},
		{
			feedbackId: 'cue_is_fading_out',
			options: { cueId: cue.id },
			style: {
				bgcolor: combineRgb(255, 100, 0),
			},
		},
	]
}

function getPresetDefinitions(self) {
	const presets = []

	if (self.cues && self.cues.length > 0) {
		self.cues.forEach((cue, index) => {
			const style = buildCueColorStyle(cue)
			presets.push({
				type: 'button',
				category: 'Sound Cues',
				name: `${index + 1}: ${cue.name || cue.id}`,
				style: {
					text: cue.name || `Cue ${index + 1}`,
					size: 'auto',
					...style,
				},
				steps: [
					{
						down: [
							{
								actionId: `toggle_cue_${cue.id}`,
								options: {},
							},
						],
						up: [],
					},
				],
				feedbacks: buildCuePlaybackFeedbacks(cue),
			})
		})
	} else {
		const presetCount = 20
		for (let i = 1; i <= presetCount; i++) {
			presets.push({
				type: 'button',
				category: 'Sound Cues',
				name: `Cue ${i}`,
				style: {
					text: `$(instance:cue_${i}_name)`,
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'toggle_cue',
								options: { cueNumber: `${i}` },
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'cue_app_color',
						options: { cueNumber: `${i}` },
					},
					{
						feedbackId: 'cue_is_playing',
						options: { cueNumber: `${i}` },
						style: {
							bgcolor: combineRgb(34, 139, 34),
						},
					},
				],
			})
		}
	}

	presets.push({
		type: 'button',
		category: 'Controls',
		name: 'Stop All Audio',
		style: {
			text: 'STOP ALL',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(200, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'stop_all',
						options: {},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	})

	presets.push({
		type: 'button',
		category: 'Controls',
		name: 'Playlist Next',
		style: {
			text: 'NEXT',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 100, 150),
		},
		steps: [
			{
				down: [
					{
						actionId: 'playlist_navigate_next',
						options: { cueNumber: '1' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	})

	presets.push({
		type: 'button',
		category: 'Controls',
		name: 'Playlist Previous',
		style: {
			text: 'PREV',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 100, 150),
		},
		steps: [
			{
				down: [
					{
						actionId: 'playlist_navigate_previous',
						options: { cueNumber: '1' },
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	})

	presets.push({
		type: 'button',
		category: 'Controls',
		name: 'Current Time',
		style: {
			text: 'TIME\\n$(instance:current_cue_time_formatted)',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(50, 50, 50),
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [],
	})

	presets.push({
		type: 'button',
		category: 'Controls',
		name: 'Duration',
		style: {
			text: 'DURATION\\n$(instance:current_cue_duration_formatted)',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(50, 50, 50),
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [],
	})

	presets.push({
		type: 'button',
		category: 'Controls',
		name: 'Remaining Time',
		style: {
			text: 'REMAINING\\n$(instance:current_cue_remaining_formatted)',
			size: 'auto',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(50, 50, 50),
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [],
	})

	return presets
}

module.exports = { getPresetDefinitions }
