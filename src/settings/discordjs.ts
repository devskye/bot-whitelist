


import { WhiteListManager } from 'core/WhiteList.js';
import 'discord.js';

declare module 'discord.js' {
  interface Client {
    WhiteListManager:WhiteListManager
  }
}