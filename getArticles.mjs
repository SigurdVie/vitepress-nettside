// Credits to Divyansh Singh
// Twitter: @_brc_dd

// Edits by Sigurd & Copilot

import fs from 'node:fs/promises';
import matter from 'gray-matter';
import removeMd from 'remove-markdown';

function formatDate(dateString) {
    // Parse the ISO date string into a Date object
    const date = new Date(dateString);
    
    // Format the date in a readable way
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'UTC'  // Ensure consistent timezone handling
    };
    
    return date.toLocaleDateString('en-US', options);
}

async function generateArticlesData() {
    try {
        // Ensure blog directory exists
        const blogDir = './docs/blog';
        const articles = await fs.readdir(blogDir);

        if (articles.length === 0) {
            console.log('No articles found in docs/blog directory');
            return;
        }

        const data = await Promise.all(
            articles
                .filter(file => file.endsWith('.md'))
                .map(async (article) => {
                    const file = matter.read(`${blogDir}/${article}`);
                    const { data, path: filePath } = file;
                    
                    // Check for <!-- more --> split
                    const moreSplit = file.content.split('<!-- more -->');
                    
                    // If <!-- more --> exists, use content before it, otherwise use first paragraph
                    const excerptContent = moreSplit.length > 1 
                        ? moreSplit[0]
                        : file.content.split('\n\n')[0];
                    
                    // Clean up the excerpt
                    const excerpt = removeMd(excerptContent)
                        .trim()
                        .replace(/\s{2,}/g, ' ');

                    // Format both date and updated date if they exist
                    const formattedDate = data.date ? formatDate(data.date) : null;
                    const formattedUpdated = data.updated ? formatDate(data.updated) : formattedDate;

                    return {
                        ...data,
                        title: removeMd(file.content.split('\n')[0]).trim(),
                        path: filePath.replace('./docs/', '').replace(/\.md$/, '.html'),
                        excerpt,
                        date: formattedDate,
                        updated: formattedUpdated
                    };
                })
        );

        // Sort articles by Updated date in descending order
        const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.updated || '1970-01-01');
            const dateB = new Date(b.updated || '1970-01-01');
            return dateB - dateA;
        });

        // Write sorted data to data.json
        await fs.writeFile('data.json', JSON.stringify(sortedData, null, 2), 'utf-8');
        console.log('Successfully generated data.json with sorted articles');

    } catch (error) {
        console.error('Error generating articles data:', error);
    }
}

generateArticlesData();