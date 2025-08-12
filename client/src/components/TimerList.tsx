import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Page,
  Layout,
  TextField,
  Button,
  EmptyState,
  ResourceList,
} from "@shopify/polaris";
import { listTimers, createTimer, deleteTimer } from "../api";
import TimerFormModal from "./TimerFormModal";
import type { Timer } from "../types";
import dayjs from "dayjs";
import "@shopify/polaris/build/esm/styles.css";

export default function TimerList({ shop }: { shop: string }) {
  const [query, setQuery] = useState("");
  const [timers, setTimers] = useState<Timer[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const data = await listTimers(shop);
    setTimers(data);
  }
  useEffect(() => {
    load();
  }, [shop]);

  const filtered = useMemo(
    () =>
      timers.filter((t) => t.name.toLowerCase().includes(query.toLowerCase())),
    [timers, query]
  );

  const items = filtered.map((t) => ({
    id: t._id!,
    name: t.name,
    start: dayjs(t.startDate).format("YYYY-MM-DD HH:mm"),
    end: dayjs(t.endDate).format("YYYY-MM-DD HH:mm"),
    description: t.description,
  }));

  return (
    <Page
      title="Countdown Timer Manager"
      primaryAction={{ content: "Create timer", onAction: () => setOpen(true) }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ display: "flex", gap: 12, padding: 16 }}>
              <TextField
                label="Search timers"
                labelHidden
                value={query}
                onChange={setQuery}
                placeholder="Search timers"
              />
            </div>
            {items.length === 0 ? (
              <EmptyState
                heading="No timers yet"
                action={{
                  content: "Create timer",
                  onAction: () => setOpen(true),
                }}
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                Create your first countdown timer.
              </EmptyState>
            ) : (
              <ResourceList
                resourceName={{ singular: "timer", plural: "timers" }}
                items={items}
                renderItem={(item) => (
                  <ResourceList.Item
                    id={item.id}
                    accessibilityLabel={`View ${item.name}`}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 220px 220px 120px",
                        gap: 12,
                        width: "100%",
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        <div style={{ color: "#6b7280" }}>
                          {item.description}
                        </div>
                      </div>
                      <div>Start: {item.start}</div>
                      <div>End: {item.end}</div>
                      <div style={{ textAlign: "right" }}>
                        <Button
                          destructive
                          onClick={async () => {
                            await deleteTimer(item.id);
                            await load();
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </ResourceList.Item>
                )}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
      <TimerFormModal
        open={open}
        onClose={() => setOpen(false)}
        shop={shop}
        onSubmit={async (t) => {
          await createTimer(t);
          setOpen(false);
          await load();
        }}
      />
    </Page>
  );
}
