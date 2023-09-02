// The server should simply serve html files

import fs from "fs";
import {
  extensionPriorityOrder,
  parseFileRecursive,
  root,
} from "./parseFileRecursive";
import path from "path";
import { parseFile } from "./parseFile";

Bun.serve({
  fetch: async (req) => {
    const pathname = new URL(req.url).pathname;

    const name = path.parse(pathname).name;

    const realName = name === "" ? "index" : name;

    // post requests should be completely handled first
    if (req.method === "POST") {
      console.log(req);
      try {
        const formData = await req.formData();
        const formDataObject: { [key: string]: string | undefined } = {};
        Array.from(formData.keys()).map((key) => {
          formDataObject[key] = formData.get(key)?.toString();
        });
        const referer = req.headers.get("referer");
        const page = referer ? path.parse(referer).name : null;
        // TODO: here we can execute add-book.js by providing all top-level variables, requiring the code and executing it
        // Putting it in the default export as function could also be a way, but seems unneeded boilerplate, right? Maybe.
        // What's interesting is to see if we can show something from this endpoint back to the user. Of course, the book can be added and you'll see that, but if it goes wrong we want an error message.
        console.log({ formDataObject, page });
      } catch (e) {}
    }

    // console.log({ pathname, name, realName });

    await Promise.all(
      extensionPriorityOrder.map(async (extension) => {
        const filename = realName + "." + extension;
        const extPath = path.join(root, filename);

        if (fs.existsSync(extPath)) {
          console.log({ filename });
          // if we want to cache this, we should consider the POST request and whether or not there's a reason to reload
          // get a weird error HERE

          /**
{
  filename: "story.md"
}
Error: Cork buffer must not be held across event loop iterations!

uh-oh: A C++ exception occurred
bun will crash now 😭😭😭

----- bun meta -----
Bun v0.8.1 (16b4bf34) macOS Silicon 21.6.0
RunCommand: 
Elapsed: 1494ms | User: 214ms | Sys: 62ms
RSS: 0.14GB | Peak: 0.14GB | Commit: 128.01MB | Faults: 0
----- bun meta -----

0   0x102754f24 WTFGetBacktrace
1   ??? Bun__crashReportDumpStackTrace
2   ??? src.report.fatal
3   ??? std::__terminate(void (*)())
4   ??? std::terminate()
5   ??? src.bun.js.event_loop.EventLoop.waitForPromise
6   ??? lol_html::rewriter::handlers_dispatcher::ContentHandlersDispatcher::handle_token::h5a43cb98a5dbd370
7   ??? lol_html::transform_stream::dispatcher::Dispatcher$LT$C$C$O$GT$::try_produce_token_from_lexeme::_$u7b$$u7b$closure$u7d$$u7d$::h7df52265509deec2
8   ??? lol_html::rewritable_units::tokens::capturer::TokenCapturer::feed::h7aedc4fdb0a976b2
9   ??? _$LT$lol_html..transform_stream..dispatcher..Dispatcher$LT$C$C$O$GT$$u20$as$u20$lol_html..parser..lexer..LexemeSink$GT$::handle_tag::h4364a334d3e62085
10  ??? lol_html::parser::lexer::actions::_$LT$impl$u20$lol_html..parser..state_machine..StateMachineActions$u20$for$u20$lol_html..parser..lexer..Lexer$LT$S$GT$$GT$::emit_tag::hf9baa89211f081bb
11  ??? lol_html::parser::state_machine::StateMachine::after_attribute_value_quoted_state::h2001ca3139f52fb9
12  ??? lol_html::parser::state_machine::StateMachine::continue_from_bookmark::h724a957c46861882
13  ??? lol_html::parser::Parser$LT$S$GT$::parse::h0dac14f83055073e
14  ??? lol_html::transform_stream::TransformStream$LT$C$C$O$GT$::write::hc954e84af144f01d
15  ??? lol_html_rewriter_write
16  ??? src.bun.js.api.html_rewriter.HTMLRewriter.BufferOutputSink.runOutputSink
17  ???
18  ??? llint_entry
19  ???
20  ??? llint_entry
21  ??? llint_entry
22  ???
23  ??? llint_entry
24  ??? llint_entry
25  ???
26  ??? llint_entry
27  ???
28  ??? llint_entry
29  ???
30  ??? llint_entry
31  ??? vmEntryToJavaScript

Crash report saved to:
  ~/.bun/.bun-crash/v0.8.1-1693569860515.crash

Search GitHub issues https://bun.sh/issues or ask for #help in https://bun.sh/discord

libc++abi: terminate_handler unexpectedly returned
[1]    52163 abort      bun run /Users/king/os/packages/user-facing/bun-server/src/ctml/server.ts
          
           */
          //  await parseFile(filename);
        }
      }),
    );

    const htmlPath = path.join(root, realName + "." + "html");

    if (fs.existsSync(htmlPath)) {
      return new Response(Bun.file(htmlPath), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("404", {
      status: 404,
      statusText: "File could not be found",
    });
  },
});
