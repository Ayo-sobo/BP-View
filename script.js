document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://nexus.drsavealife.com/blood-pressure/filter';
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const dataList = document.getElementById('data-list');
    const refreshButton = document.getElementById('refresh-button');

    let previousFirstReading = null;

    function fetchData() {
        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';

        const requestBody = {
            filter: {},
            orderBy: "id",
            order: "DESC",
            limit: "20"
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadingDiv.style.display = 'none';

            dataList.innerHTML = '';

            const list = data.data.list;

            if (list.length > 0) {
                const headerRow = document.createElement('tr');
                const headers = Object.keys(JSON.parse(list[0].readings));
                headers.forEach(headerText => {
                    const header = document.createElement('th');
                    header.textContent = headerText;
                    headerRow.appendChild(header);
                });

                
                const table = document.createElement('table');
                table.appendChild(headerRow);
                table.className = 'readings-table';

               
                list.forEach((item, index) => {
                    const readings = JSON.parse(item.readings);
                    const dataRow = document.createElement('tr');
                    headers.forEach(headerText => {
                        const cell = document.createElement('td');
                        cell.textContent = readings[headerText];
                        dataRow.appendChild(cell);
                    });
                    
                    if (index === 0) {
                        const isNewReading = JSON.stringify(readings) !== JSON.stringify(previousFirstReading);
                        if (isNewReading) {
                            dataRow.classList.add('new-reading');
                            setTimeout(() => {
                                dataRow.classList.remove('new-reading');
                            }, 20000); 
                        }
                      
                        previousFirstReading = readings;
                    }
                    table.appendChild(dataRow);
                });

             
                const li = document.createElement('li');
                li.appendChild(table);
                dataList.appendChild(li);
            }
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    fetchData();
    refreshButton.addEventListener('click', function() {
        fetchData();
    });

        setInterval(fetchData, 30000);

});