## 01

The actual need for JSON.stringify and JSON.parse arises when you need to transmit data between different environments, such as between the client and server, or when you need to store data in a format that can be easily parsed and understood by various programming languages and platforms.

JSON.stringify

The main use cases for JSON.stringify are:

Sending data over the network: When you need to send data from the client to the server or vice versa, you typically need to convert the data into a string format. JSON is a widely accepted format for data exchange, and JSON.stringify allows you to convert JavaScript objects into a JSON string representation that can be easily transmitted over the network.
Storing data in a storage medium: If you need to store data in a storage medium like a file, database, or browser storage (e.g., localStorage, sessionStorage), you often need to convert the data into a string format. JSON.stringify allows you to convert JavaScript objects into a JSON string representation that can be easily stored and retrieved later.
Logging data: When you need to log complex data structures like objects or arrays to the console or a logging system, converting them to a JSON string using JSON.stringify can make the output more readable and easier to inspect.
JSON.parse

The main use cases for JSON.parse are:

Receiving data from the network: When you receive data from the server or another source in a JSON string format, you need to convert it back into a JavaScript object or value to work with it in your code. JSON.parse allows you to convert the JSON string into a JavaScript object or value.
Retrieving data from a storage medium: If you have stored data in a storage medium like a file, database, or browser storage as a JSON string, you need to convert it back into a JavaScript object or value to work with it in your code. JSON.parse allows you to convert the JSON string into a JavaScript object or value.
Working with data in a JSON format: Sometimes, you may receive data in a JSON format from an external source or API, and you need to convert it into a JavaScript object or value to work with it in your code. JSON.parse allows you to convert the JSON data into a JavaScript object or value.
The process of converting data between JavaScript objects and JSON strings using JSON.stringify and JSON.parse is often referred to as "serialization" and "deserialization," respectively.

By converting data into a JSON string format, you can ensure that the data is transmitted or stored in a compact, standardized, and easily parsable format that can be understood by various programming languages and platforms. This promotes interoperability and facilitates data exchange between different systems and environments.

It's worth noting that while JSON.stringify and JSON.parse provide a way to convert data between JavaScript objects and JSON strings, they have limitations. For example, they cannot handle circular references or certain data types like functions or undefined. In such cases, you may need to use alternative serialization techniques or handle these cases explicitly before or after the conversion process.

## 02

Certainly, let's summarize and break down the core concepts:

1. **React Hook Form**

   - `useForm` is a hook provided by the `react-hook-form` library.
   - It returns an object `form` that contains various properties and methods for managing form state, validation, and submission.
   - Some key properties and methods of `form` include:
     - `form.control`: An object representing the form control, used to register input fields and manage their state.
     - `form.handleSubmit`: A function that handles form submission, typically called within the `onSubmit` event handler of the `<form>` element.
     - `form.formState`: An object containing the current state of the form, such as `isSubmitting`, `isDirty`, `isValid`, and `errors`.

2. **`<Form>` Component**

   - The `<Form>` component is a custom wrapper component, possibly from a UI library.
   - It receives the `form` object as props using the spread syntax: `<Form {...form}>...</Form>`.
   - This allows the `<Form>` component to access and use the properties and methods of the `form` object.

3. **`<FormField>` Component**

   - The `<FormField>` component is another custom component, likely responsible for rendering individual form fields.
   - It receives three important props:
     - `control={form.control}`: The `form.control` object from React Hook Form, used to manage the state of the form field.
     - `name="username"`: The name of the form field, which should match the key in the form data object.
     - `render={({ field }) => (...)}`: A render prop function that expects a `field` object as its argument. This `field` object contains properties and event handlers from React Hook Form, used to manage the input field.

4. **Rendering Form Field UI**

   - Inside the `render` function passed to `<FormField>`, you define the UI for the form field.
   - This typically involves using other custom components from the UI library, such as `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<Input>`, `<FormDescription>`, and `<FormMessage>`.
   - The `<Input>` (or any other input component) receives the `field` props from React Hook Form using the spread syntax: `<Input {...field} />`.

5. **The `field` Object**

   - The `field` object is provided by React Hook Form and contains various properties and event handlers related to the input field.
   - It includes properties like the current value of the input, event handlers for handling changes, blur events, and more.
   - By spreading `{...field}` onto the `<Input>` component, you're passing all these properties and event handlers to the input, allowing React Hook Form to manage its state and behavior.

6. **Mastering the Concept**
   - To master this concept, it's important to understand the roles of each component and how they work together.
   - The `useForm` hook from React Hook Form provides the core functionality for managing form state and validation.
   - The `<Form>` component acts as a wrapper that receives the `form` object and passes it down to its children.
   - The `<FormField>` component is responsible for rendering individual form fields and integrating with React Hook Form through the `control` and `render` props.
   - The UI components (`<FormItem>`, `<FormLabel>`, `<Input>`, etc.) are used to render the actual form field UI, with the `<Input>` component receiving the `field` props from React Hook Form to manage its state and behavior.
   - By breaking down the code and understanding the purpose of each component and prop, you can better grasp how they work together to create a cohesive and well-structured form system.

The key takeaway is that React Hook Form provides the core functionality for managing form state and validation, while the custom components from the UI library are responsible for rendering the form UI and integrating with React Hook Form through props like `control`, `render`, and the `field` object.

The <FormField> component uses the control prop to register the form field with the form control, while the render function receives the field object, which is then spread onto the <Input> component to manage its state and handle events.

<!-- Main point spread karo field object on the input components -->
<!--  -->

Hampe 2 cheezo important hoti hai

form.control - register karta hai appke input field ko,aur state manage karte hai
form.field - event handle karta hai

## 3

useTransition
The useTransition hook enables us to mark some state modifications as unimportant. These state updates will be performed in parallel with other state updates, but the rendering of the component will not be delayed.

The useTransition hook makes it much easier to work with sluggish, computationally intensive state updates because we can now tell React to prioritize those updates at a lower level to more critical updates, making your application appear much more performant to users.

When the useTransition hook is used, it produces an array with two values: an isPending variable and the startTransition function. While the code inside the startTransition hook is running, the isPending variable simply returns true. This variable is basically true when the slow state update is underway and false when it is finished. The startTransition function accepts a single callback, which contains all of the code associated to the slow state update, including state setting.
