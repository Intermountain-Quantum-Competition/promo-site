#!/usr/bin/env node
/**
 * Local helper to wrap plain SVG icons in the shared <symbol id="icon"> format.
 * Usage: node tools/convert-icon.js public/icons/folder-solid.svg [more svgs]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const targets = process.argv.slice(2);

if (!targets.length) {
	console.error('Usage: node tools/convert-icon.js <svg paths...>');
	process.exit(1);
}

targets.forEach(convertFile);

function convertFile(inputPath) {
	const filePath = resolve(process.cwd(), inputPath);
	let raw;

	try {
		raw = readFileSync(filePath, 'utf8');
	} catch (error) {
		console.error(`[error] Cannot read ${inputPath}:`, error.message);
		return;
	}

	if (/<symbol[^>]+id="icon"/i.test(raw)) {
		console.log(`[skip] Already in symbol format: ${inputPath}`);
		return;
	}

	const viewBoxMatch = raw.match(/viewBox="([^"]+)"/i);
	if (!viewBoxMatch) {
		console.error(`[error] Missing viewBox in ${inputPath}`);
		return;
	}
	const viewBox = viewBoxMatch[1];

	const bodyMatch = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
	if (!bodyMatch) {
		console.error(`[error] Invalid SVG markup in ${inputPath}`);
		return;
	}

	const body = bodyMatch[1].trim();
	const licenseMatch = body.match(/<!--[\s\S]*?-->/);
	const license = licenseMatch ? licenseMatch[0].trim() : '';
	const bodyWithoutComments = body.replace(/<!--[\s\S]*?-->/g, '').trim();

	const normalized = indent(normalizePaths(bodyWithoutComments), 2);
	const lines = [];

	lines.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">`);
	if (license) {
		lines.push(`\t${license}`);
	}
	lines.push(`\t<symbol id="icon" viewBox="${viewBox}">`);
	if (normalized) {
		lines.push(normalized);
	}
	lines.push(`\t</symbol>`);
	lines.push(`</svg>`);

	const output = `${lines.join('\n')}\n`;
	writeFileSync(filePath, output, 'utf8');
	console.log(`[ok] Converted ${inputPath}`);
}

function normalizePaths(markup) {
	return markup
		.replace(/<path\b([^>]*?)(\/)?>/gi, (_match, attrs, selfClosing) => {
			let cleaned = attrs.replace(/\s+/g, ' ').trim();

			if (/fill\s*=\s*"/i.test(cleaned)) {
				cleaned = cleaned.replace(/fill\s*=\s*"[^"]*"/i, 'fill="currentColor"');
			} else {
				cleaned = `${cleaned} fill="currentColor"`.trim();
			}

			const close = selfClosing ? ' />' : '>';
			return `<path ${cleaned}${close}`;
		})
		.trim();
}

function indent(block, level) {
	const pad = '\t'.repeat(level);
	return block
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => `${pad}${line}`)
		.join('\n');
}
