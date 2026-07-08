const { resolveCueId, sendWsAction } = require('./cueUtils.js')

function buildCueTargetOptions(self) {
	return [
		{
			type: 'dropdown',
			id: 'cueNumber',
			label: 'Cue (grid position)',
			default: '1',
			choices:
				self.cues && self.cues.length > 0
					? self.cues.map((cue, idx) => ({
							id: String(idx + 1),
							label: `${idx + 1}: ${cue.name || cue.id}`,
						}))
					: [{ id: '1', label: '1: (no cues)' }],
			tooltip: 'Select cue by grid position (layout order).',
		},
		{
			type: 'textinput',
			id: 'cueId',
			label: 'Cue ID (optional override)',
			default: '',
			tooltip: 'Use a specific cue ID instead of grid position when set.',
		},
	]
}

function getActionDefinitions(self) {
	const actions = {}

	actions['stop_all'] = {
		name: 'Stop All Audio',
		options: [],
		callback: () => {
			sendWsAction(self, 'stopAllCues', { behavior: 'fade_out_and_stop' })
		},
	}

	const cueNumberOption = buildCueTargetOptions(self)[0]

	async function triggerCueAction(actionName, wsAction, options, label) {
		const cueId = await resolveCueId(self, options)
		if (!cueId) {
			self.log('warn', `${label}: Cue not found or invalid target`)
			return
		}
		sendWsAction(self, wsAction, { cueId })
	}

	actions['play_cue'] = {
		name: 'Play Cue',
		options: buildCueTargetOptions(self),
		callback: async (action) => triggerCueAction('play_cue', 'playCue', action.options, 'Play Cue'),
	}

	actions['stop_cue'] = {
		name: 'Stop Cue',
		options: buildCueTargetOptions(self),
		callback: async (action) => triggerCueAction('stop_cue', 'stopCue', action.options, 'Stop Cue'),
	}

	actions['toggle_cue'] = {
		name: 'Trigger Cue',
		options: buildCueTargetOptions(self),
		callback: async (action) => triggerCueAction('toggle_cue', 'toggleCue', action.options, 'Trigger Cue'),
	}

	actions['playlist_navigate_next'] = {
		name: 'Playlist Navigate Next',
		options: [cueNumberOption],
		callback: async (action) => triggerCueAction('playlist_navigate_next', 'playlistNavigateNext', action.options, 'Playlist Navigate Next'),
	}

	actions['playlist_navigate_previous'] = {
		name: 'Playlist Navigate Previous',
		options: [cueNumberOption],
		callback: async (action) => triggerCueAction('playlist_navigate_previous', 'playlistNavigatePrevious', action.options, 'Playlist Navigate Previous'),
	}

	actions['playlist_jump_to_item'] = {
		name: 'Playlist Jump to Item',
		options: [
			...buildCueTargetOptions(self),
			{
				type: 'textinput',
				id: 'targetIndex',
				label: 'Item Index (0-based)',
				default: '0',
				tooltip: 'Zero-based index of the playlist item to jump to (first item is 0).',
			},
		],
		callback: async (action) => {
			const cueId = await resolveCueId(self, action.options)
			if (!cueId) {
				self.log('warn', 'Playlist Jump to Item: Cue not found or invalid target')
				return
			}
			const targetIndexRaw = action.options.targetIndex != null ? String(action.options.targetIndex) : '0'
			const targetIndexParsed = self.parseVariablesInString ? await self.parseVariablesInString(targetIndexRaw) : targetIndexRaw
			const targetIndex = parseInt(targetIndexParsed, 10)
			if (Number.isNaN(targetIndex) || targetIndex < 0) {
				self.log('warn', 'Playlist Jump to Item: Invalid target index')
				return
			}
			sendWsAction(self, 'playlistJumpToItem', { cueId, targetIndex })
		},
	}

	actions['set_cue_volume'] = {
		name: 'Set Cue Volume',
		options: [
			...buildCueTargetOptions(self),
			{
				type: 'number',
				id: 'volume',
				label: 'Volume (0-100)',
				default: 100,
				min: 0,
				max: 100,
			},
			{
				type: 'checkbox',
				id: 'persist',
				label: 'Persist volume to cue',
				default: true,
			},
		],
		callback: async (action) => {
			const cueId = await resolveCueId(self, action.options)
			if (!cueId) {
				self.log('warn', 'Set Cue Volume: Cue not found or invalid target')
				return
			}
			const volumePercent = Number(action.options.volume)
			const volume = Math.max(0, Math.min(1, (Number.isNaN(volumePercent) ? 100 : volumePercent) / 100))
			sendWsAction(self, 'setCueVolume', {
				cueId,
				volume,
				persist: action.options.persist !== false,
			})
		},
	}

	actions['seek_cue'] = {
		name: 'Seek Cue',
		options: [
			...buildCueTargetOptions(self),
			{
				type: 'number',
				id: 'positionSec',
				label: 'Position (seconds)',
				default: 0,
				min: 0,
			},
		],
		callback: async (action) => {
			const cueId = await resolveCueId(self, action.options)
			if (!cueId) {
				self.log('warn', 'Seek Cue: Cue not found or invalid target')
				return
			}
			sendWsAction(self, 'seekCue', {
				cueId,
				positionSec: Number(action.options.positionSec) || 0,
				finalizeScrub: true,
			})
		},
	}

	actions['prepare_seek'] = {
		name: 'Prepare Seek (scrub start)',
		options: buildCueTargetOptions(self),
		callback: async (action) => {
			const cueId = await resolveCueId(self, action.options)
			if (!cueId) {
				self.log('warn', 'Prepare Seek: Cue not found or invalid target')
				return
			}
			sendWsAction(self, 'prepareSeek', { cueId })
		},
	}

	if (self.cues && self.cues.length > 0) {
		self.cues.forEach((cue) => {
			const cueLabel = cue.name || cue.id
			actions[`play_cue_${cue.id}`] = {
				name: `Play: ${cueLabel}`,
				options: [],
				callback: async () => sendWsAction(self, 'playCue', { cueId: cue.id }),
			}
			actions[`stop_cue_${cue.id}`] = {
				name: `Stop: ${cueLabel}`,
				options: [],
				callback: async () => sendWsAction(self, 'stopCue', { cueId: cue.id }),
			}
			actions[`toggle_cue_${cue.id}`] = {
				name: `Trigger: ${cueLabel}`,
				options: [],
				callback: async () => sendWsAction(self, 'toggleCue', { cueId: cue.id }),
			}
		})
	}

	return actions
}

module.exports = { getActionDefinitions }
