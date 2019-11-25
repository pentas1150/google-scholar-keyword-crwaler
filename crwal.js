const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config();

let paperTitle = [];
let keywordCount = [];

const replaceAll = (srcStr, searchStr, replaceStr) => {
    return srcStr.split(searchStr).join(replaceStr);
}

const getHtml = async(page_number, search_string, start_year) => {
    try {
        const start_count = (Number(page_number) - 1) * 10;
        const search_keyword = replaceAll(search_string, " ", "+");
        let url = `https://scholar.google.com/scholar?start=${start_count}&q=${search_keyword}`;
        if(start_year !== 0)
            url+=`&as_ylo=${start_year}`;

        return await axios.get(url);
    } catch(err) {
        console.error(err);
    }
};

const getPaperTitle  = async(search, year) => {
    try {
        for(let i=1; i<=Number(process.env.END_PAGE); ++i) {
            const html = await getHtml(i, search, year);

            const $ = cheerio.load(html.data);
            const $bodylist = $("h3");

            let title_cnt = 0;
            $bodylist.each(function(idx, elem) {
                paperTitle.push($(this).find("a").text());
                title_cnt++;
            });
            if(title_cnt === 0)
                return;
        }
    } catch(err) {
        console.error(err);
    }
};

const wordCount = () => {
    paperTitle.forEach((title) => {
        title.split(" ").forEach((keyword) => {
            const isExist = keywordCount.find((elem, idx) => {
                return elem.keyword === keyword;
            });
            if(isExist === undefined) {
                keywordCount.push({ keyword : keyword, count : 1 });
            } else {
                isExist.count++;
            }
        });
    });
};

const runApp = async() => {
    await getPaperTitle(process.env.SEARCH, process.env.START_YEAR);
    wordCount();
    keywordCount.sort((a, b) => {
        return b.count - a.count;
    });
    keywordCount.forEach((elem) => {
        fs.writeFileSync('./result.txt', `${elem.keyword} : ${elem.count}`, 'utf8');
    });
};

runApp();