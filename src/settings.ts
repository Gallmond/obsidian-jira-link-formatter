import { App, PluginSettingTab, Setting } from 'obsidian';
import JiraTicketFormatterPlugin from './main';

export interface MyPluginSettings {
	jiraHost: string | null;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	jiraHost: null,
};

export class JiraTicketFormatterSettingTab extends PluginSettingTab {
	plugin: JiraTicketFormatterPlugin;

	constructor(app: App, plugin: JiraTicketFormatterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Jira domain')
			.setDesc("If you use the web UI at https://your-business.atlassian.net then your domain Jira domain is 'your-business.atlassian.net'")
			.addText((text) =>
				text
					.setPlaceholder('your-business.atlassian.net')
					.setValue(this.plugin.settings.jiraHost ?? '')
					.onChange(async (value) => {
						this.plugin.settings.jiraHost = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
