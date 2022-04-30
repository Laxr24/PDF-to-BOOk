// Dom selector

var pageNumbers = document.querySelector("#pageNumber")
var currentPageNumbers = document.querySelector("#currentPage")
var viewer = document.querySelector("#viewer")
var nextPage = document.querySelector("#p_n")
var prevPage = document.querySelector("#p_p")


// Global variable
var totalPages;
var currentPage = 1

// initial rendering
renderPage(currentPage)
currentPageNumbers.textContent = currentPage

// On next page request
nextPage.onclick = () => {
    currentPage = currentPage + 1
    renderPage(currentPage)
    currentPageNumbers.textContent = currentPage
}



// On previous page request
prevPage.onclick = () => {
    currentPage = currentPage - 1
    renderPage(currentPage)
    currentPageNumbers.textContent = currentPage
}


// Main render asynchronous function 
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

            var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] :
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
 * So, the params. are -  totalPage, printSegment, ranges[array], sheet
 * 
 * 
 * The printed segment should be flipped around the longest edege
 */

// Printable book calculation asynchronous function 
function bookLet(src, segment = 1) {
    var loadingTask = pdfjsLib.getDocument(src);
    loadingTask.promise.then(function (pdf) {
        let totalPage = pdf._pdfInfo.numPages;
        // let totalPage = 97;
        let sheet = Math.ceil(totalPage / 2);
        let segments = segment

        let pageOrder = []
        //[1,2,3,4,5,6,7,8,9,10,11,12]
        let reOrder = []
        //[12,11,10,9,8,7,6,5,4,3,2,1]
        // Split the array in two half
        // Sequence join 
        // [12,10,8] + [1,3,5]
        // Flip log edge
        // [2,4,6]+[11,9,7]
        // [ (12,1), (10,3) , (8, 5) -- flip operation -- (2,11) , (4,9) , (6,7)  ]

        for (let i = 1; i <= totalPage+1; i++) {
            pageOrder.push(i)
        }

        pageOrder.reverse()

        let pair = [Math.floor(pageOrder.length/2)-1, Math.floor(pageOrder.length/2) ]
        console.log(`Pair indexes are : (${pair})`)

        console.log(`Pair value from arrayare : (${pageOrder[pair[0]]}, ${pageOrder[pair[1]]})`);


        console.log(pageOrder);


        if (segment > 1) {
            console.log("The book will be printed in multiple segments: " + segments);
            console.log("Total page: " + totalPage);
            console.log("Printing the segment needs: " + Math.ceil(sheet/segments) + " Sheets");
        } else {
            console.log("Total page: " + totalPage);
            console.log("Printing the book needs: " + sheet/2 + " Sheets");
        }


    })
}

bookLet("test.pdf")