'use strict'

import { IProtocol, IPeerDescriptor } from '../interfaces'

export interface IHandler<P> {
  name: string,
  id: string | number,
  networkProvider: IProtocol<P>,
  peer: IPeerDescriptor<P>

  /**
   * Handle an incoming message
   *
   * @param msg - the message to be sent
   */
  handle<T, U> (msg: T | T[]): Promise<U>
  handle<T, U> (msg: T | T[]): Promise<U[]>
  handle<T, U> (msg: T | T[]): Promise<U | U[]>

  /**
   * Send a request
   *
   * @param msg - the message to be sent
   */
  request<T, U> (msg: T | T[]): Promise<U>
  request<T, U> (msg: T | T[]): Promise<U[]>
  request<T, U> (msg: T | T[]): Promise<U | U[]>
}