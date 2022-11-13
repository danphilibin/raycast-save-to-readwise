import { Form, ActionPanel, Action, showHUD, popToRoot } from "@raycast/api";
import { getInfoFromBrowser } from "./util/url";
import { readwiseRequest } from "./util/readwise";
import { useOpenGraph } from "./util/scraper";

type Values = {
  text: string;
  source_url: string;
  title: string;
  note: string;
};

function blankStringToUndef(str: string): string | undefined {
  return str === "" ? undefined : str;
}

export default function Command() {
  const url = getInfoFromBrowser();
  const og = useOpenGraph(url.url);

  function handleSubmit(body: Values) {
    readwiseRequest("/v2/highlights", "POST", {
      highlights: [
        {
          text: body.text,
          source_url: body.source_url,
          title: blankStringToUndef(body.title),
          note: blankStringToUndef(body.note),
        },
      ],
    }).then(() => {
      showHUD("Highlight created");
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
      <Form.TextArea id="text" title="Highlight text" />
      <Form.TextField
        id="source_url"
        title="URL"
        defaultValue={url.url}
        error={url.error}
      />
      <Form.TextField id="title" title="Title" defaultValue={url.title} />
      <Form.TextField id="note" title="Note" />
    </Form>
  );
}
