Date: June 16 2026

## Context

Read a book about system design it was a philosophy of software design by John Ousterhout, and it changed my view on how i want to approach my current app and future projects. The book explains well on the value of simplicity and less complex implementations. It requires less cognitive load for other developers and even ai to comprehend a module or an interface. The previous Workout session was reaching to the point that i have 2 God Hooks that i find it extremely hard to read. no matter how i reason with claude code it still deems it as fine. But according to the book and ever since from me, its very hard to work with and comprehend (High Cognitive load) in Ousterhout's terms. I Realized the side effects of being a tactical tornado, features are being shipped but code is messy and i dont think this is the right direction for me.

## Decision

My decision was scrapping my session feature and wiping out all my hooks and logics and rewriting them from scratch with my new knowledge. It has been great. Code became extremely much more readable, you can clearly see the linear data flow. I Avoided shallow interfaces and implementation and went with more narrow approaches, Hooks that dont just call a DAO but calls a DAO holds states and it has a purpose, a simple interface with a somewhat deep implementation.

## My Rule of thumb or learnings summarized

1 put react related funcitons in a hook, anything that does not use React functions (useMemo,useState,useContext etc) will be sent to a "core" folder. It provided clear separation on what reusable js code i can use and what react modules are.

2 Avoid shallow interfaces. what this means is abstracting by modulizing a hook or a js function but it only envokes to 1 function, then that isnt really worth it. That just adds an extra thing to learn that other developers need to comprehend.

3 Please Avoid prop drilling as much as possibe, use context or state management if needed. Prop drilling in the eyes of AI was fine, but not for me, hooks became God hooks and it ended up making the code extremely unreadable. if you notice you keep passing and passing over and over again, just consider using contexts or a state manager (but still i think normal context is better at this scale)

4 Prefer a generalist approach on hooks, think of maybe i can use this hook again in soon, so we avoid hard coding some values and make it more reusable. Think about what if we need to use this in another component, or someone else needs to use this?. Then in the near future, either the new developer will make a similar clone but slightly different output and usage. Or end up editing that existing hook and having to end up edit all the existing components that envoked that hook before. leading to just more complexity and potential bugs.
