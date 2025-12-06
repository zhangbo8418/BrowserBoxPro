export default function Landing(state) {
  const {Wrap} = state.boilerplate;
  
  return Wrap(state, "远程浏览器隔离", `
        <section class=content>
          <section class=introduction tabindex=0>
            <div class=story>
              <h1>欢迎使用安全浏览。</h1>
              <p>
                在这个充满风险的世界中，我们为您提供最简单、最好的浏览器隔离平台。
              </p>
            </div>
            <div class=graphic>
              <img src=/images/3rd-party/undraw/security.svg>
            </div>
          </section>
        </section>
     `,
     `
          <section class=content>
            <section class=introduction tabindex=0>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/securityon.svg>
              </div>
              <div class=story>
                <h1>以客户为先的安全。</h1>
                <p>
                  我们以客户为先，提供与您正常的不安全浏览器最相似的浏览体验，但没有风险。我们的容错浏览器即服务基础设施
                  能够安全可靠地提供完全托管、完全托管和完全远程的云浏览器，无论您需要什么规模。
                  我们熟悉的 Web 客户端看起来和使用起来就像使用您常规的不安全浏览器一样，
                  可在所有现代和传统平台上运行，无需下载，甚至在移动设备上也可以。
                </p>
              </div>
            </section>
            <section class=protection tabindex=0>
              <div class=story>
                <h1>更私密。更安全。更多控制。</h1>
                <p>
                  BrowserBox 永远不会在您的机器或网络上运行来自远程页面的任何 JavaScript、小程序、CSS 或 HTML。通过完全隔离您的基础设施免受网络风险，这意味着恶意软件、漏洞利用、勒索软件、广告软件和其他网络风险无法危害您的运营。
                </p>
              </div>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/safe.svg>
              </div>
            </section>
            <section class=security tabindex=0>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/container.svg>
              </div>
              <div class=story>
                <h1>最高安全性。完全隔离。</h1>
                <p>
                  BrowserBox 永远不会在您的机器上运行任何远程代码。永远不会。我们永远不会在您的机器上运行来自远程浏览器的任何 JavaScript、小程序、CSS，甚至不会运行一个 HTML 标签。我们的平台是唯一可以在任何设备上运行的浏览器隔离系统，并且永远不会在您的机器上运行任何代码。我们提供远程网页的完全交互式图像，看起来和使用起来就像在您最喜欢的消费浏览器上浏览一样，但没有任何与此相关的常规风险。
                </p>
              </div>
            </section>
            <section class=introduction tabindex=0>
              <hr class=diagonal>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/future.svg>
              </div>
              <div class=story>
                <h1>什么是浏览器隔离？</h1>
                <p>
                  浏览器隔离是一种安全实践，您可以将网络与互联网隔离。所有浏览都通过安全通道进行，使用隔离的远程云浏览器。
                </p>
              </div>
            </section>
            <section class=introduction tabindex=0>
              <div class=points>
                <h1>什么是 BrowserBox？</h1>
                <ul>
                  <li>安全浏览，熟悉的界面。
                  <li>浏览器隔离供应商
                  <li>云浏览器提供商
                  <li>远程浏览器产品
                  <li>无需安装或下载。
                  <li>浏览器即服务
                </ul>
              </div>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/question.svg>
              </div>
            </section>
            <section class=introduction tabindex=0>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/helpfulsign.svg>
              </div>
              <div class=story>
                <h1>BrowserBox。区别在于它的工作方式。</h1>
                <p>
                  BrowserBox 只是众多浏览器隔离供应商之一。您应该根据您的特定需求选择最好的供应商。BrowserBox 专注于提供出色的客户支持，以及最类似于常规不安全浏览器的用户界面和体验，但没有风险。
                </p>
              </div>
            </section>
            <section class=security tabindex=0>
              <div class=points>
                <h1>BrowserBox 如何保护我的隐私和安全？</h1>
                <ul>
                  <li>远程云浏览器
                  <li>完全浏览器隔离
                  <li>威胁遏制
                  <li>所有执行都在远程 DMZ 中进行
                  <li>无代码"交互式图像"技术
                  <li>零信任安全
                  <li>永远不会向您发送来自远程网页的 JavaScript、cookie、HTML/CSS。
                </ul>
              </div>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/privacy.svg>
              </div>
            </section>
            <section class=introduction tabindex=0>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/undraw_hologram_fjwp.svg>
              </div>
              <div class=story>
                <h1>浏览器隔离如何帮助保护我的网络？</h1>
                <p>
                  我们的完全隔离系统意味着永远不会向您发送来自远程页面的任何 JavaScript 代码、图像、HTML、CSS 或其他资产。您通过安全层与互联网交互，类似于科学家在通风橱中进行实验或在生物安全柜中进行危险品隔离。原理非常相似，我们的完全隔离系统确保从网络到您始终保持"负压"。这意味着实际上没有任何网络内容到达您，除非通过该内容的全息图像，该图像完全交互但完全惰性。
                </p>
              </div>
            </section>
            <section class=protection tabindex=0>
              <div class=points>
                <h1>BrowserBox 能阻止什么？</h1>
                <ul>
                  <li>零日漏洞利用
                  <li>恶意网站和网络应用
                  <li>浏览器利用
                  <li>恶意软件和病毒
                  <li>设备 rootkit
                  <li>广告软件和跟踪
                  <li>勒索软件
                </ul>
              </div>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/cleanup.svg>
              </div>
            </section>
            <section class=reliability tabindex=0>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/mobilebrowsers.svg>
              </div>
              <div class=story>
                <h1>看起来和使用起来就像普通浏览器一样。</h1>
                <p>
                  BrowserBox 提供远程网页的完全交互式图像，看起来和使用起来就像在您最喜欢的消费浏览器上浏览一样，但没有任何与此相关的常规风险。您可以轻松打开新标签页、观看视频（以降低的帧率）、下载文件甚至播放音频。
                </p>
              </div>
            </section>
            <section class=reliability tabindex=0>
              <div class=points>
                <h1>BrowserBox 的维护成本有多高？</h1>
                <ul>
                  <li>完全托管
                  <li>完全托管
                  <li>完全熟悉的浏览器界面
                  <li>零或最少的培训要求
                  <li>按席位、订阅定价
                </ul>
              </div>
              <div class=graphic>
                <img src=/images/3rd-party/undraw/chill.svg>
              </div>
            </section>
            <section class=cta>
              <a href=#membership-application class="register toggle-opener">
                <span class=verbose-name>申请会员</span> 现在
              </a>
            </section>
          </section>
  `);
}
