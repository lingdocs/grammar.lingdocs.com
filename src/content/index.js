/**
 * Copyright (c) 2021 lingdocs.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable import/no-webpack-loader-syntax */
import * as about from "!babel-loader!mdx-loader!./about.mdx";

import * as equativePresent from "!babel-loader!mdx-loader!./equatives/equative-present.mdx"
import * as equativeOthers from "!babel-loader!mdx-loader!./equatives/equative-others.mdx";
// import * as advancedEquative from "!babel-loader!mdx-loader!./equative/equative-advanced.mdx";

import * as verbEndings from "!babel-loader!mdx-loader!./verbs/verb-endings.mdx";
import * as rootsAndStems from "!babel-loader!mdx-loader!./verbs/roots-and-stems.mdx";
import * as sentenceStructure from "!babel-loader!mdx-loader!./verbs/sentence-structure.mdx";

import * as pronounsBasic from "!babel-loader!mdx-loader!./pronouns/pronouns-basic.mdx";
import * as pronounsMini from "!babel-loader!mdx-loader!./pronouns/pronouns-mini.mdx";

import * as inflectionPatterns from "!babel-loader!mdx-loader!./inflection/inflection-patterns.mdx";

const contentTree = [
    {
        import: about,
        slug: "about",
    },
    {
        heading: "Equatives",
        subdirectory: "equatives",
        chapters: [
            {
                import: equativePresent,
                slug: "equative-present",
            },
            {
                import: equativeOthers,
                slug: "equative-others",
            },
        ],
    },
    {
        heading: "Verbs",
        subdirectory: "verbs",
        chapters: [
            {
                import: verbEndings,
                slug: "verb-endings",
            },
            {
                import: rootsAndStems,
                slug: "roots-and-stems",
            },
            {
                import: sentenceStructure,
                slug: "sentence-structure",
            },
        ],
    },
    {
        heading: "Pronouns",
        subdirectory: "pronouns",
        chapters: [
            {
                import: pronounsBasic,
                slug: "pronouns-basic",
            },
            {
                import: pronounsMini,
                slug: "pronouns-mini",
            },
        ],
    },
    {
        heading: "Inflection",
        subdirectory: "inflection",
        chapters: [
            {
                import: inflectionPatterns,
                slug: "inflection-patterns",
            },
        ],
    },
];

export const content = contentTree.map((item) => {
    function prepareChapter(chp, subdir) {
        return {
            path: subdir ? `/${subdir}/${chp.slug}/` : `/${chp.slug}/`,
            slug: chp.slug,
            content: chp.import.default,
            frontMatter: chp.import.frontMatter,
            tableOfContents: chp.import.tableOfContents(),
        };
    }
    return (item.import)
        ? prepareChapter(item)
        : {
            ...item,
            chapters: item.chapters.map((c) => {
                return prepareChapter(c, item.subdirectory);
            }),
        };
}).map((item, i, items) => {
    // make the next and previous page information for each chapter
    function withNextPrev(current, index, arr) {
        function getInfo(x) {
            return x.content
                ? { frontMatter: x.frontMatter, path: x.path }
                : { frontMatter: x.chapters[0].frontMatter, path: x.chapters[0].path }; // TODO: KILL THIS?
        }
        function getNextOutsideItem() {
            return items[i+1].content
                // if it's a single chapter section, get that chapter
                ? items[i+1]
                // if it's a section with multiple chapters, get the first chapter
                : items[i+1].chapters[0];
        }
        function getPrevOutsideItem() {
            return items[i-1].content
                // if it's a single chapter section, get that chapter
                ? items[i-1]
                // if it's a section with multiple chapters, get the last chapter
                : items[i-1].chapters[items[i-1].chapters.length - 1];
        }
        const next = index < arr.length - 1
            // if there's another chapter in this section, that's the next one
            ? arr[index+1]
            // no? maybe there's another chapter or section in front of us
            : (i < items.length - 1)
            ? getNextOutsideItem()
            : false;
        const prev = index !== 0
            // if there's another chapter in this section, that's the previous one
            ? arr[index-1]
            // no? maybe we there's a chapter or section behind us
            : (i !== 0)
            ? getPrevOutsideItem()
            : false;
        return {
            ...current,
            ...prev ? {
                prev: getInfo(prev),
            } : {},
            ...next ? {
                next: getInfo(next),
            } : {},
        };
    }
    if (item.content) {
        return withNextPrev(item, i, items);
    }
    return {
        ...item,
        chapters: item.chapters.map((chapter, j, chapters) => (
            withNextPrev(chapter, j, chapters)
        )),
    }
});


// // Now that the paths are made, go through and make the next and previous page information for each chapter
// // STEP #2
// content.sections.forEach((section, i) => {
//     section.chapters.forEach((chapter, j) => {
//         // See if there's a next chapter
//         let nextChapter = j === section.chapters.length - 1 ? null : section.chapters[j + 1];
//         if (!nextChapter) {
//             // No? maybe there's something a section ahead (if that exists) 
//             nextChapter = i === content.sections.length - 1 ? null : content.sections[i + 1].chapters[0];
//         }
//         if (nextChapter) {
//             chapter.next = { frontMatter: nextChapter, path: nextChapter.path };
//         }
//         // See if there's a previous chapter
//         let prevChapter = j === 0 ? null : section.chapters[j - 1];
//         if (!prevChapter) {
//             // No? maybe there's something a section behind (if that exists) 
//             prevChapter = i === 0 ? null : content.sections[i - 1].chapters[content.sections[i - 1].chapters.length - 1];
//         }
//         if (prevChapter) {
//             chapter.previous = { frontMatter: prevChapter, path: prevChapter.path };
//         }
//     });
// });
