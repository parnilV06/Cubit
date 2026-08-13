/**
 * Cubit Trainer — Explicit Safe MDX Component Registry
 * 
 * Maps approved JSX element names to their secure, sandboxed React implementations.
 * Prevents arbitrary code execution and restricts MDX capabilities to authorized UI modules.
 */

import CubeViewer from '../cube/CubeViewer.jsx';
import AlgorithmPlayer from '../cube/AlgorithmPlayer.jsx';
import NotationTrainer from '../cube/NotationTrainer.jsx';
import Callout from './Callout.jsx';
import WhatNext from '../navigation/WhatNext.jsx';
import LessonNavigation from '../navigation/LessonNavigation.jsx';

/**
 * Authoritative registry of approved components accessible from Trainer MDX lessons.
 */
export const COMPONENT_REGISTRY = {
  CubeViewer,
  AlgorithmPlayer,
  NotationTrainer,
  Callout,
  WhatNext,
  LessonNavigation,
};

/**
 * Look up a registered component by its tag name.
 * Returns null if the component is unauthorized or unknown.
 * 
 * @param {string} name 
 * @returns {React.ComponentType|null}
 */
export function getRegisteredComponent(name) {
  if (!name || typeof name !== 'string') return null;
  return COMPONENT_REGISTRY[name] || null;
}

export default COMPONENT_REGISTRY;
