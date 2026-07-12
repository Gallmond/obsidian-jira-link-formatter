import {
	Editor,
	MarkdownView,
	MarkdownFileInfo,
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	JiraTicketFormatterSettingTab,
} from './settings';
import getPathnameTicket from './getPathnameTicket';

type Result<T, E> = { ok: true, val: T } | { ok: false, err: E }

export default class JiraTicketFormatterPlugin extends Plugin {
	settings!: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new JiraTicketFormatterSettingTab(this.app, this));
		this.app.workspace.on('editor-paste', (evt: ClipboardEvent, editor: Editor, _info: MarkdownView | MarkdownFileInfo) => {
			// indicates something else has already reacted to this paste event
			if (evt.defaultPrevented) return

			const userHost = this.configuredHost
			if (!userHost) return

			const pasted = this.getText(evt)
			if (!pasted) return

			if (!pasted.toLowerCase().includes(userHost.toLowerCase())) return

			// get valid url from string, or exit
			const url = this.parseUrl(pasted, userHost)
			if (!url) return

			// compare host of pasted url
			if (!this.hostValid(url, userHost)) return

			// has a ticket
			const ticketStr = getPathnameTicket(url)
			if (!ticketStr) return

			// insert the text
			editor.replaceRange(`[${ticketStr}](${pasted})`, editor.getCursor())

			// mark event has handled
			evt.preventDefault()
		})
	}

	getText(evt: ClipboardEvent): string | null {
		const pastedData = evt.clipboardData?.getData('text').trim() ?? ''
		return pastedData === '' ? null : pastedData
	}

	get configuredHost(): string | null {
		const { jiraHost } = this.settings
		return typeof jiraHost === 'string' && jiraHost !== ''
			? jiraHost : null
	}

	hostValid(u: URL, userHost: string): boolean {
		// discard port if present
		const host = u.host.split(':')[0] ?? ''

		return userHost.toLowerCase() === host.toLowerCase()
	}

	/**
	 * Get a URL from a string, with optional protocol
	 * @example
	 * parseUrl('https://foo.atlassian.net/browse/AB-1234') // URL
	 * parseUrl('foo.atlassian.net/browse/AB-1234') // URL
	 * parseUrl('not a valid url') // null
	 */
	parseUrl(s: string, userHost: string) {
		const url = this.attempt(() => {
			const lc = s.toLowerCase()

			const protocol = lc.startsWith('https://') || lc.startsWith('http://')
				? ''
				: 'https://'

			return new URL(`${protocol}${s}`, `https://${userHost}`)
		})

		return url.ok ? url.val : null
	}

	attempt<T>(fn: () => T): Result<T, Error> {
		try {
			return {
				ok: true,
				val: fn()
			}
		} catch (cause) {
			return {
				ok: false,
				err: cause instanceof Error ? cause : new Error('err')
			}
		}
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
