import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import marked from "marked";

const Post = ({ htmlString, data }) => {
    return (
        <div>
            <Head>
                <title>{data.title}</title>
                <meta title="description" content={data.desccription}></meta>
            </Head>
            <div dangerouslySetInnerHTML={{ __html: htmlString }} />
        </div>
    );
};

export const getStaticPaths = async () => {
    //We wanna create a page per post
    //Thus we will simply read the paths from the posts folder.
    const files = fs.readdirSync("posts");
    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace(".md", ""),
        },
    }));
    console.log(paths, files);
    return {
        paths, //There may be 20 different paths for posts, thus here we need to tell next, what these different paths are?
        fallback: false, //false means, we are gonna build everything on buildtime.
    };
};

// This fn is used for fetching the data for our template.
export const getStaticProps = async ({ params: { slug } }) => {
    const markdownWithMetaData = fs
        .readFileSync(path.join("posts", slug + ".md"))
        .toString();
    const parsedMarkDown = matter(markdownWithMetaData);
    const htmlString = marked(parsedMarkDown.content);

    return {
        props: {
            // contents: parsedMarkDown.content,
            data: parsedMarkDown.data,
            htmlString,
        },
    };
};

export default Post;
