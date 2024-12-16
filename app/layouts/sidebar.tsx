import { useState, useEffect } from "react";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useNavigation,
  useSubmit,
} from "react-router";
import { getContacts } from "../data";
import type { Route } from "./+types/sidebar";

// Because this is a GET, not a POST, React Router does not call the action function.
// Submitting a GET form is the same as clicking a link: only the URL changes.
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = 
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  // Approach 1
  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  // Approach 2
  // the query now needs to be kept in state
  // we still have a `useEffect` to synchronize the query
  // to the component state on back/forward button clicks
  // const [query, setQuery] = useState(q || "");
  // useEffect(() => {
  //     setQuery(q || "");
  // }, [q])

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          <Form id="search-form" role="search">
            <input
              aria-label="Search contacts"
              // Approach 1
              defaultValue={q || ""}
              className={searching ? "loading": ""}
              id="q"
              name="q"
              placeholder="Search"
              onChange={(event) => {
                const isFirstSearch = q === null;
                submit(event.currentTarget, {
                    replace: !isFirstSearch
                });
              }}
              type="search"
              // Approach 2
              //   onChange={(event) => {
              //     setQuery(event.currentTarget.value)
              //   }}
              // Approach 2
              // value={query}
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        className={navigation.state === "loading" && !searching ? "loading" : ""}
        id="detail"
      >
        <Outlet />
      </div>
    </>
  );
}
