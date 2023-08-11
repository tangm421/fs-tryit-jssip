'use strict';

import clone from 'clone';
import deepmerge from 'deepmerge';
import Logger from './Logger';

import storage from './storage';

const logger = new Logger('settingsManager');

const DEFAULT_SIP_DOMAIN = '10.18.0.200';
const DEFAULT_SETTINGS =
{
	display_name        : null,
	uri                 : null,
	password            : null,
	socket              :
	{
		uri           : 'ws://10.18.0.200:5066',
		via_transport : 'auto',
	},
	registrar_server    : null,
	contact_uri         : null,
	authorization_user  : null,
	instance_id         : null,
	session_timers      : true,
	session_timers_expires	: 120,
	use_preloaded_route : false,
	pcConfig            :
	{
		iceServers  :
		[
			{urls : 'stun:stun.l.google.com:19302'},
			{
				urls : [
					'stun:stun1.l.google.com:19302',
					'stun:stun2.l.google.com:19302',
					'stun:stun3.l.google.com:19302',
					'stun:stun4.l.google.com:19302'
				]
			},
			{
				urls : ['stun:120.26.89.217:3478'],
				username: 'inter_user',
				credential: 'power_turn'
			}
		]
	},
	callstats           :
	{
		enabled   : false,
		AppID     : null,
		AppSecret : null
	}
};

let settings;

// First, read settings from local storage
settings = storage.get();

if (settings)
	logger.debug('settings found in local storage');

// Try to read settings from a global SETTINGS object
if (window.SETTINGS)
{
	logger.debug('window.SETTINGS found');

	settings = deepmerge(window.SETTINGS, settings || {}, true);
}

// If not settings are found, clone default ones
if (!settings)
{
	logger.debug('no settings found, using default ones');

	settings = clone(DEFAULT_SETTINGS, false);
}

module.exports =
{
	get()
	{
		return settings;
	},

	set(newSettings)
	{
		storage.set(newSettings);
		settings = newSettings;
	},

	clear()
	{
		storage.clear();
		settings = clone(DEFAULT_SETTINGS, false);
	},

	isReady()
	{
		return !!settings.uri;
	},

	getDefaultDomain()
	{
		return DEFAULT_SIP_DOMAIN;
	}
};
