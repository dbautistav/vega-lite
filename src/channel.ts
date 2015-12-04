/*
 * Constants and utilities for encoding channels (Visual variables)
 * such as 'x', 'y', 'color'.
 */

import {Marktype} from './marktype';

export enum Channel {
  X = <any>'x',
  Y = <any>'y',
  ROW = <any>'row',
  COLUMN = <any>'column',
  SHAPE = <any>'shape',
  SIZE = <any>'size',
  COLOR = <any>'color',
  TEXT = <any>'text',
  DETAIL = <any>'detail',
}

export const X = Channel.X;
export const Y = Channel.Y;
export const ROW = Channel.ROW;
export const COLUMN = Channel.COLUMN;
export const SHAPE = Channel.SHAPE;
export const SIZE = Channel.SIZE;
export const COLOR = Channel.COLOR;
export const TEXT = Channel.TEXT;
export const DETAIL = Channel.DETAIL;

export const CHANNELS = [X, Y, ROW, COLUMN, SIZE, SHAPE, COLOR, TEXT, DETAIL];

interface SupportedMarktype {
  [marktype: string]: boolean;
};

/**
 * Return whether a channel supports a particular mark type.
 * @param channel  channel name
 * @param marktype the mark type
 * @return whether the marktype supports the channel
 */
export function supportMarktype(channel: Channel, marktype: Marktype) {
  return !!getSupportedMarktype(channel)[marktype];
}

/**
 * Return a dictionary showing whether a channel supports mark type.
 * @param channel
 * @return A dictionary mapping mark types to boolean values.
 */
export function getSupportedMarktype(channel: Channel): SupportedMarktype {
  switch (channel) {
    case X:
    case Y:
      return {
        point: true, tick: true, circle: true, square: true ,
        bar: true, line: true, area: true
      };
    case ROW:
    case COLUMN:
      return {
        point: true, tick: true, circle: true, square: true,
        bar: true, line: true, area: true, text: true
      };
    case SIZE:
      return {
        point: true, tick: true, circle: true, square: true,
        bar: true, text: true
      };
    case COLOR:
    case DETAIL:
      return {
        point: true, tick: true, circle: true, square: true,
        bar: true, line: true, area: true, text: true
      };
    case SHAPE:
      return {point: true};
    case TEXT:
      return {text: true};
  }
  return {};
}

interface SupportedRole {
  [role:string]:boolean;
};

/**
 * Return whether a channel supports dimension / measure role
 * @param  channel
 * @return A dictionary mapping role to boolean values.
 */
export function getSupportedRole(channel: Channel): SupportedRole {
  switch (channel) {
    case X:
    case Y:
    case COLOR:
      return {
        measure: true,
        dimension: true
      };
    case ROW:
    case COLUMN:
    case SHAPE:
    case DETAIL:
      return {
        measure: false,
        dimension: true
      };
    case SIZE:
    case TEXT:
      return {
        measure: true,
        dimension: false
      };
  }
  throw new Error('Invalid encoding channel' + channel);
}