/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Semantic versioning of document.
 */
export type Version = string;
/**
 * The code identifying the CLI, UI, service generating the order.
 */
export type AppCode = string;
/**
 * Environment from which the order came from.
 */
export type Environment = string;
/**
 * The address of the trader who signs the CoW Swap order. This field should normally be omitted; it is recommended to use it if the signer is a smart-contract wallet using EIP-1271 signatures.
 */
export type Signer = string;
export type ReferrerAddress = string;
/**
 * Tracks in which medium the traffic originated from (twitter, facebook, etc.)
 */
export type UTMSource = string;
/**
 * Tracks in which medium the traffic originated from (mail, CPC, social, etc.)
 */
export type UTMMedium = string;
/**
 * Track the performance of a specific campaign
 */
export type UTMCampaign = string;
/**
 * Track which link was clicked
 */
export type UTMContent = string;
/**
 * Track which keyword term a website visitor came from
 */
export type UTMKeywordTerm = string;
/**
 * Slippage tolerance that was applied to the order to get the limit price. Expressed in Basis Points (BPS)
 */
export type SlippageBips = string;
/**
 * Indicator of the order class.
 */
export type OrderClass1 = "market" | "limit" | "liquidity" | "twap";
/**
 * Semantic versioning of document.
 */
export type Version1 = string;
/**
 * The contract to call for the hook
 */
export type HookTarget = string;
/**
 * The calldata to use when calling the hook
 */
export type HookCallData = string;
/**
 * The gas limit (in gas units) for the hook
 */
export type HookGasLimit = string;
/**
 * CoW Hooks to call before an order executes
 */
export type PreHooks = CoWHook[];
/**
 * CoW Hooks to call after an order executes
 */
export type PostHooks = CoWHook[];
/**
 * The code identifying the UI powering the widget
 */
export type AppCode1 = string;
/**
 * Environment from which the order came from.
 */
export type Environment1 = string;

/**
 * Metadata JSON document for adding information to orders.
 */
export interface AppDataRootSchema {
  version: Version;
  appCode?: AppCode;
  environment?: Environment;
  metadata: Metadata;
}
/**
 * Each metadata will specify one aspect of the order.
 */
export interface Metadata {
  signer?: Signer;
  referrer?: Referrer;
  utm?: UTMCodes;
  quote?: Quote;
  orderClass?: OrderClass;
  hooks?: OrderInteractionHooks;
  widget?: Widget;
}
export interface Referrer {
  address: ReferrerAddress;
}
export interface UTMCodes {
  utmSource?: UTMSource;
  utmMedium?: UTMMedium;
  utmCampaign?: UTMCampaign;
  utmContent?: UTMContent;
  utmTerm?: UTMKeywordTerm;
}
export interface Quote {
  slippageBips: SlippageBips;
}
export interface OrderClass {
  orderClass: OrderClass1;
}
/**
 * Optional Pre and Post order interaction hooks attached to a single order
 */
export interface OrderInteractionHooks {
  version?: Version1;
  pre?: PreHooks;
  post?: PostHooks;
}
export interface CoWHook {
  target: HookTarget;
  callData: HookCallData;
  gasLimit: HookGasLimit;
}
export interface Widget {
  appCode: AppCode1;
  environment?: Environment1;
}
