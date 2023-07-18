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
 * Slippage tolerance that was applied to the order to get the limit price. Expressed in Basis Points (BIPS)
 */
export type SlippageBips = string;
/**
 * Indicator of the order class.
 */
export type OrderClass1 = "market" | "limit" | "liquidity" | "twap";

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
  referrer?: Referrer;
  utm?: UTMCodes;
  quote?: Quote;
  orderClass?: OrderClass;
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
