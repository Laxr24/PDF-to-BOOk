// Dom selector

var pageNumbers = document.querySelector("#pageNumber")
var currentPageNumbers = document.querySelector("#currentPage")
var viewer = document.querySelector("#viewer")
var nextPage = document.querySelector("#p_n")
var prevPage = document.querySelector("#p_p")


// Global variable
var totalPages;
var currentPage = 1

renderPage(currentPage)
currentPageNumbers.textContent = currentPage


nextPage.onclick = () => {
    currentPage = currentPage + 1
    renderPage(currentPage)
    currentPageNumbers.textContent = currentPage
}
prevPage.onclick = () => {
    currentPage = currentPage - 1
    renderPage(currentPage)
    currentPageNumbers.textContent = currentPage
}

function renderPage(currentPage) {

    var loadingTask = pdfjsLib.getDocument('test.pdf');
    loadingTask.promise.then(function (pdf) {

        totalPages = pdf._pdfInfo.numPages;

        if (totalPages != 0) {
            pageNumbers.textContent = totalPages
        }

        pdf.getPage(currentPage).then(function (page) {
            var scale = .5;
            var viewport = page.getViewport({
                scale: scale,
            });
            // Support HiDPI-screens.
            var outputScale = window.devicePixelRatio || 1;

            var canvas = viewer;
            var context = canvas.getContext('2d');

            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height = Math.floor(viewport.height) + "px";

            var transform = outputScale !== 1 ?
                [outputScale, 0, 0, outputScale, 0, 0] :
                null;

            var renderContext = {
                canvasContext: context,
                transform: transform,
                viewport: viewport
            };
            page.render(renderContext);
        });

    });



}


function bookLet(src){
    var loadingTask = pdfjsLib.getDocument(src);
    loadingTask.promise.then(function (pdf) {
        let totalPage = pdf._pdfInfo.numPages;
        let bookLetPage = Math.ceil(totalPage/2);

        console.log("Total page: "+ totalPage);
        console.log("Book sheet: " + bookLetPage);
    })
}

bookLet("test.pdf")



/** 
 * Suppose there is a book with total page of 11
 * So, the PrintBook will take 6 Paper sheets
 * 
 * Now if you want to print the book in 1 Juzz(খন্ড)
 * then the range will be 1-11,
 * if you wanto to print the book in 2 Juss(খন্ড)
 * then the range will be (1-5)(3 page), (6-11)(3 page)
 * 
 * 
 * So, the params. are -  totalPage, printSegment, ranges[array]
 * 
 * 
 * The printed segment should be flipped around the longest edege
 */