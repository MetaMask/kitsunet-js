export class Decoder {
  static decode (input: any, enc: any): any;
  static decodeAll (input: any, enc: any): any;
  static decodeFirst (input: any, enc: any): any;
  constructor(opts: any);
  parser: any;
  createArray (arr: any, len: any): any;
  createByteString (raw: any, len: any): any;
  createByteStringFromHeap (start: any, end: any): any;
  createFalse (): any;
  createFloat (val: any): any;
  createFloatDouble (a: any, b: any, c: any, d: any, e: any, f: any, g: any, h: any): any;
  createFloatSingle (a: any, b: any, c: any, d: any): any;
  createInfinity (): any;
  createInfinityNeg (): any;
  createInt (val: any): any;
  createInt32 (f: any, g: any): any;
  createInt32Neg (f: any, g: any): any;
  createInt64 (f1: any, f2: any, g1: any, g2: any): any;
  createInt64Neg (f1: any, f2: any, g1: any, g2: any): any;
  createMap (obj: any, len: any): any;
  createNaN (): any;
  createNaNNeg (): any;
  createNull (): any;
  createObject (obj: any, len: any): any;
  createSimpleUnassigned (val: any): any;
  createTag (tagNumber: any, value: any): any;
  createTrue (): any;
  createUndefined (): void;
  createUtf8String (raw: any, len: any): any;
  createUtf8StringFromHeap (start: any, end: any): any;
  decodeAll (input: any): any;
  decodeFirst (input: any): any;
  pushArrayStart (): void;
  pushArrayStartFixed (len: any): void;
  pushArrayStartFixed32 (len1: any, len2: any): void;
  pushArrayStartFixed64 (len1: any, len2: any, len3: any, len4: any): void;
  pushBreak (): void;
  pushByteString (start: any, end: any): void;
  pushByteStringStart (): void;
  pushFalse (): void;
  pushFloat (val: any): void;
  pushFloatDouble (a: any, b: any, c: any, d: any, e: any, f: any, g: any, h: any): void;
  pushFloatSingle (a: any, b: any, c: any, d: any): void;
  pushInfinity (): void;
  pushInfinityNeg (): void;
  pushInt (val: any): void;
  pushInt32 (f: any, g: any): void;
  pushInt32Neg (f: any, g: any): void;
  pushInt64 (f1: any, f2: any, g1: any, g2: any): void;
  pushInt64Neg (f1: any, f2: any, g1: any, g2: any): void;
  pushNaN (): void;
  pushNaNNeg (): void;
  pushNull (): void;
  pushObjectStart (): void;
  pushObjectStartFixed (len: any): void;
  pushObjectStartFixed32 (len1: any, len2: any): void;
  pushObjectStartFixed64 (len1: any, len2: any, len3: any, len4: any): void;
  pushSimpleUnassigned (val: any): void;
  pushTagStart (tag: any): void;
  pushTagStart4 (f: any, g: any): void;
  pushTagStart8 (f1: any, f2: any, g1: any, g2: any): void;
  pushTagUnassigned (tagNumber: any): void;
  pushTrue (): void;
  pushUndefined (): void;
  pushUtf8String (start: any, end: any): void;
  pushUtf8StringStart (): void;
}
export class Diagnose {
  static decode (input: any, enc: any): any;
  static decodeAll (input: any, enc: any): any;
  static decodeFirst (input: any, enc: any): any;
  static diagnose (input: any, enc: any): any;
  createArray (arr: any, len: any): any;
  createByteString (raw: any, len: any): any;
  createByteStringFromHeap (start: any, end: any): any;
  createFalse (): any;
  createFloat (val: any): any;
  createFloatDouble (a: any, b: any, c: any, d: any, e: any, f: any, g: any, h: any): any;
  createFloatSingle (a: any, b: any, c: any, d: any): any;
  createInfinity (): any;
  createInfinityNeg (): any;
  createInt (val: any): any;
  createInt32 (f: any, g: any): any;
  createInt32Neg (f: any, g: any): any;
  createInt64 (f1: any, f2: any, g1: any, g2: any): any;
  createInt64Neg (f1: any, f2: any, g1: any, g2: any): any;
  createMap (map: any, len: any): any;
  createNaN (): any;
  createNaNNeg (): any;
  createNull (): any;
  createObject (obj: any, len: any): any;
  createSimpleUnassigned (val: any): any;
  createTag (tagNumber: any, value: any): any;
  createTrue (): any;
  createUndefined (): any;
  createUtf8String (raw: any, len: any): any;
  createUtf8StringFromHeap (start: any, end: any): any;
  decodeAll (input: any): any;
  decodeFirst (input: any): any;
  pushArrayStart (): void;
  pushArrayStartFixed (len: any): void;
  pushArrayStartFixed32 (len1: any, len2: any): void;
  pushArrayStartFixed64 (len1: any, len2: any, len3: any, len4: any): void;
  pushBreak (): void;
  pushByteString (start: any, end: any): void;
  pushByteStringStart (): void;
  pushFalse (): void;
  pushFloat (val: any): void;
  pushFloatDouble (a: any, b: any, c: any, d: any, e: any, f: any, g: any, h: any): void;
  pushFloatSingle (a: any, b: any, c: any, d: any): void;
  pushInfinity (): void;
  pushInfinityNeg (): void;
  pushInt (val: any): void;
  pushInt32 (f: any, g: any): void;
  pushInt32Neg (f: any, g: any): void;
  pushInt64 (f1: any, f2: any, g1: any, g2: any): void;
  pushInt64Neg (f1: any, f2: any, g1: any, g2: any): void;
  pushNaN (): void;
  pushNaNNeg (): void;
  pushNull (): void;
  pushObjectStart (): void;
  pushObjectStartFixed (len: any): void;
  pushObjectStartFixed32 (len1: any, len2: any): void;
  pushObjectStartFixed64 (len1: any, len2: any, len3: any, len4: any): void;
  pushSimpleUnassigned (val: any): void;
  pushTagStart (tag: any): void;
  pushTagStart4 (f: any, g: any): void;
  pushTagStart8 (f1: any, f2: any, g1: any, g2: any): void;
  pushTagUnassigned (tagNumber: any): void;
  pushTrue (): void;
  pushUndefined (): void;
  pushUtf8String (start: any, end: any): void;
  pushUtf8StringStart (): void;
}
export class Encoder {
  static encode (o: any): any;
  constructor(options: any);
  streaming: any;
  onData: any;
  semanticTypes: any;
  addSemanticType (type: any, fun: any): any;
  finalize (): any;
  push (val: any): any;
  pushAny (obj: any): any;
  pushWrite (val: any, method: any, len: any): any;
  write (obj: any): any;
}
export class Simple {
  static decode (val: any, hasParent: any): any;
  static isSimple (obj: any): any;
  constructor(value: any);
  value: any;
  encodeCBOR (gen: any): any;
  inspect (): any;
}
export class Tagged {
  constructor(tag: any, value: any, err: any);
  tag: any;
  value: any;
  err: any;
  convert (converters: any): any;
  encodeCBOR (gen: any): any;
}
export function decode (input: any, enc: any): any;
export function decodeAll (input: any, enc: any): any;
export function decodeFirst (input: any, enc: any): any;
export function diagnose (input: any, enc: any): any;
export function encode (o: any): any;
export namespace leveldb {
  const buffer: boolean;
  function decode (input: any, enc: any): any;
  function encode (o: any): any;
  const name: string;
}
