import { createFileRoute, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { UploadPanel } from "@/components/UploadPanel";
import { DocumentList } from "@/components/DocumentList";
import { Button } from "@/components/ui/button";
import { documentsListQuery } from "@/lib/documents";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Folio — Upload a document, share a link" },
      {
        name: "description",
        content: "Drop in any document and get a link anyone can open — PDFs, Word, Excel, slides, images and more.",
      },
      { property: "og:title", content: "Folio — Upload a document, share a link" },
      {
        property: "og:description",
        content: "Drop in any document and get a link anyone can open.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(documentsListQuery),
  component: Index,
  errorComponent: ListError,
});

function ListError({ error }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="font-display text-3xl">The shelf didn't load</p>
        <p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : "Please try again."}</p>
        <Button className="mt-6" variant="ink" onClick={() => router.invalidate()}>
          Try again
        </Button>
      </div>
    </div>
  );
}

function Index() {
  const { data: documents } = useSuspenseQuery(documentsListQuery);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5">
        <section
          id="upload"
          className="grid scroll-mt-8 gap-10 py-14 md:grid-cols-[1.05fr_1fr] md:items-center md:py-20"
        >
          <div className="animate-rise">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Upload → Link → Done
            </p>
            <h1 className="mt-4 font-display text-6xl leading-[0.95] text-foreground md:text-7xl">
              Any document,
              <br />
              <em className="text-primary">one link</em> away.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Upload a file and share the link. Anyone who opens it can read it right in the browser —
              no account, no app.
            </p>
          </div>
          <div className="animate-rise [animation-delay:120ms]">
            <UploadPanel />
          </div>
        </section>
        <div className="pb-24">
          <DocumentList documents={documents} />
        </div>
      </main>
    </div>
  );
}
