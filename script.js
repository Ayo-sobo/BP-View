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
            
            console.log("Data is plenty", data.data.list)
            dataList.innerHTML = '';

            const list = data.data.list;

            const headers = [
                {title: "Device ID", key: "deviceimei"}, 
                {title: "SYS", key: "SYS"}, 
                {title: "DIA", key: "DIA"}, 
                {title: "PUL", key: "PUL"}, 
                {title: "Time", key: "createtime"}]
                const headerRow = document.createElement('tr');
                headers.forEach(header => {
                    const _header = document.createElement('th');
                    _header.textContent = header.title;
                    headerRow.appendChild(_header);
                });
                
            const table = document.createElement('table');
            table.appendChild(headerRow);
            table.className = 'readings-table';
            if (list.length > 0) {
                list.forEach((item, index) => {
                    const readings = JSON.parse(item.readings);
                    const dataRow = document.createElement('tr');
                    headers.forEach(_header => {
                        const cell = document.createElement('td');
                        console.log(_header, readings)
                        cell.textContent = readings[_header.key] ?? '-';
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