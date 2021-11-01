import {
  getSolidDataset,
  getStringNoLocale,
  getThing,
  getUrl,
} from '@inrupt/solid-client';
import * as base58 from 'micro-base58';

const VOCAB_PREFIX = 'https://understory.coop/vocab/garden#';
export const UG = {
  slateJSON: `${VOCAB_PREFIX}slateJSON`,
  noteUrl: `${VOCAB_PREFIX}noteUrl`,
  usesConcept: `${VOCAB_PREFIX}usesConcept`,
  usesConceptIndex: `${VOCAB_PREFIX}usesConceptIndex`,
  conceptPrefix: `${VOCAB_PREFIX}conceptPrefix`,
  tagPrefix: `${VOCAB_PREFIX}tagPrefix`,
  storedAt: `${VOCAB_PREFIX}storedAt`,
  usesCSS: `${VOCAB_PREFIX}usesCSS`,
  monetizedFor: `${VOCAB_PREFIX}monetizedFor`,
};

export const conceptNameToUrlSafeId = (name: string) =>
  base58.encode(name.toLowerCase());

export const urlSafeIdToConceptName = (id: string) => {
  return new TextDecoder().decode(base58.decode(id));
};

export function conceptUriToName(conceptUri: string) {
  return urlSafeIdToConceptName(conceptUri.split('#').slice(-1)[0]);
}

export function noteUriToName(noteUri: string) {
  return urlSafeIdToConceptName(
    noteUri
      .split('/')
      .slice(-1)[0]
      .split('.')[0]
  );
}

export function tagNameToUrlSafeId(tagName: string) {
  return encodeURIComponent(tagName);
}

export function getTagNameFromNode(node: any){
  return node.name
}

export async function loadNote(url: string) {
  const name = noteUriToName(url);
  const noteResource = await getSolidDataset(url);
  const note = getThing(noteResource, url);
  const body = note && getStringNoLocale(note, UG.slateJSON);
  return { name, body };
}

export async function loadConcept(indexUrl: string, url: string) {
  const conceptIndex = await getSolidDataset(indexUrl);
  const concept = getThing(conceptIndex, url);
  const noteUrl = concept && getUrl(concept, UG.storedAt);
  return noteUrl && loadNote(noteUrl);
}

export async function loadPublicGnomeConfig(url: string) {
  const gnomeConfigResource = await getSolidDataset(url);
  const gnomeConfigThing = getThing(gnomeConfigResource, url);
  const gnomeConfig = {
    url,
    config: gnomeConfigThing,
  };
  return gnomeConfig;
}
