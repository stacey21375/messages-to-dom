export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6x1 px-6 py-10 text-center">
        <div className="mb-8 rounded-3x1 border border-pink-500/30 bg-zinc-950 p-6 shadow-[0_0_40px_rgba(255,79,163,0.25)]"
          <h1 className="text-5x1 font-bold tracking-wide text-pink-300 md:text-7x1"> Messages to Dom
        </h1>
        <p className="mt-4 text-lg text-zinc-300"> Every Letter Carries a Heart.
          </p>
          </div>
          <p className=mx-auto max-w-3x1 text-lg leading-8 text-zinc-300"> A place where fans from around the world can share messages of encouragement, stories, photos, and memories celebrating the positive impact Dom has had on their lives.
          </p>
          <div class Name=my-10 flex flex-col justify-center gap-4 sm:flex-row">
          <a
          href="#send"
          className="rounded-full bg-pink-500 px-8 py-4 font-semibold text-black shadow-pink-500/30 hover:bg-pink-400">
            Send a Letter
            </a>
            
            <a
            href="#letters"
            className="roundid-full border border-pink-400 px-8 py-4 font-semibold text-pink-300 hover:bg-pink-500/10">
              >
              Read Letters
              </a>
              </div>
              </section>
              ,section className="mb-auto max-w-6x1 px-6 py-12">
              Featured Letters
              </h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                {["Sarah", "Jamie", "Lily"].map((name) => (
                 <div
                 key={name}
                 className="rounded-2x1 border border-pink-5oo/20 bg-zinc-950 p-6 shadow-lg>
                 <p className=text-sm text-pink-300>From: {name}</p>
                 <p className="mt-4 text-zinc-300:> Dom, thank you for inspiring kindness, strength, and hope.
                 </p>
                 <button className="mt-6 text-pink-300 hover:text-pink-200"> Open <Letter></button><div>
  ))}
  </div>
  </section>
  <section id="send" className="mx-auto max-w-3x1 px-6 py-12">
    <div className="rounded-3x1 border border-pink-500/30 bg-zinc-950 p-8">
    <h2 className="text-3x1 font-bold text-pink-300">Send a Letter to <Dom>
      </h2>
      <p className="mt-3 text-zinc-400"> The full submission form will go here next.
        </p>
        </p></Dom></h2></div>
  </section></div></Letter></button>" 
                ))
              </div>
              </section>
              </main>
              );

          </main>
        </p></h1>
      </section>
    </main>
            );