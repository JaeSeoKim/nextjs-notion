import { Client } from "@notionhq/client";
import { PagesRetrieveResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  RichText,
  TitlePropertyValue,
} from "@notionhq/client/build/src/api-types";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (
  databaseId: string,
  {
    start_cursor,
    page_size = 100,
  }: {
    start_cursor?: string;
    page_size: number;
  }
) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    start_cursor: start_cursor,
    page_size: page_size,
  });
  return response.results;
};

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({
    page_id: pageId,
  });
  return response;
};

export const getBlocks = async (
  blockId: string,
  {
    start_cursor,
    page_size = 50,
  }: {
    start_cursor?: string;
    page_size: number;
  }
) => {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: page_size,
    start_cursor: start_cursor,
  });
  return response.results;
};

export const getTitleFromPage = (
  page: PagesRetrieveResponse,
  titleKey: string = "Name"
) => {
  let title: RichText[] = [];
  if (page.parent.type === ("page_id" || "workspace")) {
    title = (page.properties.title as TitlePropertyValue).title;
  } else if (page.parent.type === "database_id") {
    title = (page.properties[titleKey] as TitlePropertyValue).title;
  }
  return title.map(({ plain_text }) => plain_text).join("");
};
