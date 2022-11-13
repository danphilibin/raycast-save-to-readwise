import { Form, ActionPanel, Action, showHUD, popToRoot } from "@raycast/api";
import { getInfoFromBrowser } from "./util/url";
import { readwiseRequest } from "./util/readwise";
import { useOpenGraph } from "./util/scraper";

type Values = {
  url: string;
  title: string;
  summary: string;
  tags: string;
};

function blankStringToUndef(str: string): string | undefined {
  return str === "" ? undefined : str;
}

export default function Command() {
  const url = getInfoFromBrowser();
  const og = useOpenGraph(url.url);

  function handleSubmit(body: Values) {
    readwiseRequest("/save", "POST", {
      url: body.url,
      title: blankStringToUndef(body.title),
      summary: blankStringToUndef(body.summary),
      tags: body.tags ? body.tags.split(", ") : undefined,
    }).then((res) => {
      showHUD("Bookmark created");
      popToRoot();
    });
  }

  return (
    <Form
      isLoading={!og}
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={(values: Values) => {
              handleSubmit(values);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="url"
        title="URL"
        defaultValue={url.url}
        error={url.error}
      />
      <Form.TextField id="tags" title="Tags" />
      <Form.TextField id="title" title="Title" defaultValue={url.title} />
      {!!og && (
        <>
          <Form.TextArea
            id="summary"
            title="Description"
            defaultValue={og.description}
          />
        </>
      )}
    </Form>
  );
}
