function Link({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function ConceptSourceBlock({ title, authentic, sources }) {
  return (
    <div className="about__era">
      <div className="about__era-head">
        <span className="about__era-title">{title}</span>
      </div>
      <div className="about__era-row">
        <span className="about__era-label">What's real</span>
        <span>{authentic}</span>
      </div>
      <div className="about__era-row">
        <span className="about__era-label">Sources</span>
        <ul className="about__sources">
          {sources.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="about">
      <section className="about__section">
        <h3 className="about__h">Credits</h3>
        <p>
          Designed and guided by Summer Royal and Daniela Ganelin.
          Code written by{" "}
          <Link href="https://claude.com/claude-code">Claude Code</Link>.
        </p>
        <p className="about__sub">
          Made for high-school students curious about how machines learned to see.
        </p>
        <p className="about__sub">
          Inspired by{" "}
          <Link href="https://github.com/diganelin/nlp-eras">Daniela Ganelin's NLP Eras lecture</Link>
          {" "}(<Link href="https://nlp-eras.vercel.app">nlp-eras.vercel.app</Link>).
        </p>
      </section>

      <section className="about__section">
        <h3 className="about__h">Sources, by concept</h3>

        <ConceptSourceBlock
          title="How Computers See"
          authentic="The pixel art objects and RGB color model are standard computer science. The pixel grid interaction is an original activity; no external dataset is used."
          sources={[
            <>Kirsch, R. et al. (1957). First digital image scan at the National Bureau of Standards.</>,
            <>RGB color model: standard computer graphics (see any graphics textbook).</>,
          ]}
        />

        <ConceptSourceBlock
          title="One Neuron"
          authentic="The neuron math (weighted sum + bias + ReLU) is standard. The questions and suggested inputs are original. The computation walkthrough mirrors how modern deep learning frameworks compute a single unit."
          sources={[
            <>Rosenblatt, F. (1958). "The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain." <em>Psychological Review</em>, 65(6), 386–408.</>,
            <>Goodfellow, I., Bengio, Y., &amp; Courville, A. (2016). <em>Deep Learning</em>. MIT Press. <Link href="https://www.deeplearningbook.org/">deeplearningbook.org</Link></>,
          ]}
        />

        <ConceptSourceBlock
          title="A Network"
          authentic="The XOR scatter plot uses a synthetic dataset. The pre-trained weights are hand-designed to correctly solve the XOR pattern. The forward pass arithmetic is real."
          sources={[
            <>Rumelhart, D., Hinton, G., &amp; Williams, R. (1986). "Learning representations by back-propagating errors." <em>Nature</em>, 323, 533–536.</>,
            <>Cybenko, G. (1989). "Approximation by superpositions of a sigmoidal function." Universal approximation theorem.</>,
          ]}
        />

        <ConceptSourceBlock
          title="Seeing Patterns"
          authentic="The filter kernels (Sobel edge detectors, box blur, sharpen) are standard image processing filters. The convolution arithmetic is real. The 8×8 input image is a hand-crafted pixel-art smiley face (not a photograph)."
          sources={[
            <>LeCun, Y. et al. (1998). "Gradient-based learning applied to document recognition." <em>Proceedings of the IEEE</em>, 86(11), 2278–2324.</>,
            <>Sobel, I. &amp; Feldman, G. (1968). A 3×3 isotropic gradient operator for image processing.</>,
          ]}
        />

        <ConceptSourceBlock
          title="Digit Classifier"
          authentic="The drawing canvas sends your digit to a real PyTorch CNN (MNISTNet) trained on the MNIST dataset. The pixel grid, conv1 feature maps, conv2 feature maps, and output probabilities are all real model activations returned by the Flask server."
          sources={[
            <>LeCun, Y., Cortes, C., &amp; Burges, C.J.C. (1998). <em>THE MNIST DATABASE of handwritten digits</em>. <Link href="http://yann.lecun.com/exdb/mnist/">yann.lecun.com/exdb/mnist</Link></>,
            <>LeCun, Y. et al. (1998). "Gradient-based learning applied to document recognition." <em>Proceedings of the IEEE</em>, 86(11).</>,
          ]}
        />

        <ConceptSourceBlock
          title="Learning to See"
          authentic="The training demo runs real backpropagation in the browser on a synthetic 20-point dataset. The network architecture (2→2→1) and gradient descent implementation are standard."
          sources={[
            <>Krizhevsky, A., Sutskever, I., &amp; Hinton, G. (2012). "ImageNet Classification with Deep Convolutional Neural Networks." <em>NeurIPS 2012</em>. <Link href="https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html">paper link</Link></>,
            <>Rumelhart, D., Hinton, G., &amp; Williams, R. (1986). Backpropagation — same algorithm, scaled up.</>,
          ]}
        />
      </section>
    </div>
  );
}
