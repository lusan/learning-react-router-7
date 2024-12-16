import { redirect } from "react-router";
import type { Route } from "./+types/destroy-contact";

import { deleteContact } from "../data";

// When the user clicks the submit button:

// <Form> prevents the default browser behavior of sending a new document POST request to the server, but instead emulates the browser by creating a POST request with client side routing and fetch
// The <Form action="destroy"> matches the new route at contacts/:contactId/destroy and sends it the request
// After the action redirects, React Router calls all the loaders for the data on the page to get the latest values (this is "revalidation"). loaderData in routes/contact.tsx now has new values and causes the components to update!

export async function action({ params }: Route.ActionArgs) {
    await deleteContact(params.contactId);
    return redirect("/");
}