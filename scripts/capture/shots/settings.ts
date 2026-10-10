/** Shots for the settings docs. Each agent/author edits only its area's file; see CONTRIBUTING.md (Screenshots). */
import { type ShotDef, text } from './define.ts';
import { T } from '../lib/session.ts';

export const shots: ShotDef[] = [
	{
		name: 'settings-general',
		page: 'app/settings/general',
		route: '#/app/settings/general',
		alt: "Settings, General section, in a local workspace: the settings menu (Preferences, Assistant Notch, Providers, Local models, Storage, Security, Privacy, Site access) and a card explaining that the workspace is saved on this device, with a Sign in button to create an account.",
		note: 'Local (anonymous) workspace. The signed-in view (avatar, username, password, newsletter) needs an account and is not captured.',
		hotspots: [
			{ id: 'settings-sections', label: 'Settings sections', locate: (p) => p.getByRole('main').getByText('Preferences', { exact: true }).first() },
			{ id: 'sign-manage-profile', label: 'Sign in to manage your profile', locate: (p) => p.getByRole('main').getByRole('button', { name: 'Sign in' }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/general');
			await s.page.getByRole('main').getByRole('button', { name: 'Sign in' }).waitFor({ timeout: T });
		}
	},
	{
		name: 'settings-index',
		page: 'app/settings',
		route: '#/app/settings',
		viewport: { width: 400, height: 860 },
		alt: 'Settings at side-panel width (400 px), in a local workspace: three groups of rows, each with a one-line status. Account: General (Local workspace · Sign in). App: Preferences, Assistant Notch (Off), Providers (None configured), Local models (0 installed), Storage. Safety & privacy: Security (Safe mode · Off (Trusted)), Privacy and Site access (No hosts granted yet).',
		hotspots: [
			{ id: 'account', label: 'Account', locate: (p) => p.getByRole('link', { name: /^General/ }) },
			{ id: 'app', label: 'App', locate: (p) => p.getByRole('link', { name: /^Preferences/ }) },
			{ id: 'safety-privacy', label: 'Safety & privacy', locate: (p) => p.getByRole('link', { name: /^Security/ }) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings');
			await s.page.getByRole('link', { name: /^Site access/ }).waitFor({ timeout: T });
			await s.page.waitForTimeout(800);
		}
	},
	{
		name: 'settings-notch',
		page: 'app/settings/notch',
		route: '#/app/settings/notch',
		alt: 'Settings, Assistant Notch, with Show the assistant bubble on web pages switched on: Resting form (Orb, Pill, Edge tab, Orb + badge), Accent colours, Size S, M or L, the Blocks list (On this page, Pinned workflows, Quick actions, Page tools, and Recent marked Soon) with move and on/off controls, Where it shows (All sites; Allowlist only marked Soon), and Discard and Save buttons.',
		hotspots: [
			{ id: 'show-bubble-on-web', label: 'Show the bubble on web pages', locate: (p) => p.getByRole('switch', { name: /Show the assistant bubble/ }) },
			{ id: 'resting-form', label: 'Resting form, accent and size', locate: (p) => p.getByRole('main').getByText('Resting form', { exact: false }).first() },
			{ id: 'blocks', label: 'Blocks: order and on/off', locate: (p) => p.getByRole('main').getByText('Pinned workflows', { exact: true }).first() },
			{ id: 'save-discard', label: 'Save or Discard', locate: (p) => p.getByRole('main').getByRole('button', { name: 'Save' }).last() }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/notch');
			const page = s.page;
			const sw = page.getByRole('switch', { name: /Show the assistant bubble/ });
			await sw.waitFor({ timeout: T });
			if ((await sw.getAttribute('aria-checked')) !== 'true') await sw.click({ timeout: T });
			await page.getByRole('main').getByText('Pinned workflows', { exact: true }).first().waitFor({ timeout: T });
			await page.waitForTimeout(600);
		}
	},
	{
		name: 'settings-access',
		page: 'app/settings/access',
		route: '#/app/settings/access',
		alt: 'Settings, Site access, in a new local workspace: the Site & app access page explains that access is granted when a workflow first needs a host or an app, notes that enforcement is off for your own workflows (Trusted mode) with a link to Security, and says no site or app access has been granted yet.',
		note: 'A fresh workspace has no grants: a granted host needs a workflow to ask for it and the user to allow it.',
		hotspots: [
			{ id: 'enforcement-own-workflows', label: 'Enforcement for your own workflows: see Security', locate: (p) => p.getByRole('main').getByRole('button', { name: 'Security' }) },
			{ id: 'granted-hosts-apps-appear', label: 'Granted hosts and apps appear here', locate: text(/No site or app access granted yet/) }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/access');
			await s.page.getByText(/No site or app access granted yet/).waitFor({ timeout: T });
			await s.page.waitForTimeout(500);
		}
	},
	{
		name: 'settings-security',
		page: 'app/settings/security',
		route: '#/app/settings/security',
		alt: 'Settings, Security: the Site access for your workflows card with Safe mode for my workflows switched on. Its text reads: On. Your workflows must be granted access to each external URL before they can contact it, the same per-host check installed workflows get, with a link to Site access.',
		hotspots: [
			{ id: 'safe-mode-my-workflows', label: 'Safe mode for my workflows: On', locate: (p) => p.getByRole('switch', { name: 'Safe mode for my workflows' }) },
			{ id: 'manage-granted-sites-site', label: 'Manage granted sites in Site access', locate: (p) => p.getByRole('main').getByRole('link', { name: 'Site access' }).last() }
		],
		prepare: async (s) => {
			await s.go('#/app/settings/security');
			const page = s.page;
			const sw = page.getByRole('switch', { name: 'Safe mode for my workflows' });
			await sw.waitFor({ timeout: T });
			if ((await sw.getAttribute('aria-checked')) !== 'true') await sw.click({ timeout: T });
			await page.getByText(/^On\. Your workflows must be granted/).waitFor({ timeout: T });
			await page.waitForTimeout(500);
		}
	},
];
