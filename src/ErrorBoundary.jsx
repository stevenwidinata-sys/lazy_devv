import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-zinc-950 p-8 text-zinc-100">
          <section className="card mx-auto max-w-lg p-6">
            <h1 className="text-xl font-black">Lazy Dev hit an error</h1>
            <p className="mt-2 text-zinc-400">
              Refresh page. Your saved shortcuts remain in this browser.
            </p>
            <button
              className="button mt-5 bg-violet-500 text-white"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
