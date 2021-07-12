/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { content } from "../content/index";

const TableOfContentsPage = () => {
  function handleShare() {
    if (!navigator.share) {
      // should be impossible
      alert("Sorry, Sharing links are not supported on your device.");
      return;
    }
    navigator.share && navigator.share({
      title: "LingDocs Pashto Grammar",
      url: "https://grammar.lingdocs.com",
    });
  }
  return <>
    <main className="col bg-faded py-3 d-flex flex-column">
      <div className="flex-shrink-0">
        <div className="mb-2" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", maxWidth: "700px" }}>
          <h1>Table of Contents</h1>
          {navigator.share && <div onClick={handleShare} className="clickable">
            <i className="fas fa-share-alt" style={{ fontSize: "1.8rem" }} />
          </div>}
        </div>
        {content.map((section) => (
          section.path ?
            <Link to={section.path} className="plain-link">
              <h3 className="mb-3">{section.frontMatter.title}</h3>
            </Link>
          : <div>
            <Link to={section.chapters[0].path} className="plain-link">
              <h3>{section.heading}</h3>
            </Link>
            <div className="ml-3">
              {section.chapters.map((chapter) => (
                <Link to={chapter.path} className="plain-link">
                  <div className="my-3" style={{ fontSize: "larger"}}>
                    {chapter.frontMatter.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </main>
  </>;
};

export default TableOfContentsPage;