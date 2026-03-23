let compareData = [];

document.addEventListener("DOMContentLoaded", function(){

  // 🔥 MAIN COMPARE FUNCTION (CONNECTED TO BUTTON)
  window.compareConfigs = function() {

    try {
      const dc0Data = JSON.parse(document.getElementById("dc0").value);
      const dc1rwData = JSON.parse(document.getElementById("dc1rw").value);
      const dc1roData = JSON.parse(document.getElementById("dc1ro").value);

      fetch("https://compare-ui-60067766397.development.catalystserverless.in/server/compare/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dc0: dc0Data,
          dc1rw: dc1rwData,
          dc1ro: dc1roData
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);

        compareData = data;       // store data globally
        renderTable(data);        // show table
      })
      .catch(err => {
        console.error(err);
        alert("API Error: " + err);
      });

    } catch(e){
      alert("❌ Invalid JSON format! Check your input.");
    }
  };


  // 🔥 RENDER MAIN TABLE
  function renderTable(data){
    let total=0, match=0, mismatch=0;

    let html = `<table>
    <tr>
      <th>Type</th>
      <th>Key</th>
      <th>DC0</th>
      <th>DC1-RW</th>
      <th>DC1-RO</th>
      <th>Status</th>
    </tr>`;

    data.forEach(item=>{
      total++;

      let rowClass = item.status === "MATCH" ? "match" : "mismatch";

      if(item.status==="MATCH") match++;
      else mismatch++;

      html += `<tr class="${rowClass}">
        <td>${item.type || ""}</td>
        <td>${item.key || ""}</td>
        <td>${item.dc0 || ""}</td>
        <td>${item.dc1rw || ""}</td>
        <td>${item.dc1ro || ""}</td>
        <td>${item.status || ""}</td>
      </tr>`;
    });

    html += "</table>";

    document.getElementById("tableContainer").innerHTML = html;
    document.getElementById("totalKeys").innerText = total;
    document.getElementById("matchCount").innerText = match;
    document.getElementById("mismatchCount").innerText = mismatch;
  }


  // 🔍 FILTER: SHOW ONLY MISMATCH
  window.showMismatch = function(){
    document.querySelectorAll("#tableContainer table tr").forEach((row,i)=>{
      if(i===0) return;
      row.style.display = row.classList.contains("mismatch") ? "" : "none";
    });
  };


  // 🔍 FILTER: SHOW ALL
  window.showAll = function(){
    document.querySelectorAll("#tableContainer table tr").forEach(r=>r.style.display="");
  };


  // 🔍 SEARCH
  const searchInput = document.getElementById("search");

  if (searchInput) {
    searchInput.addEventListener("input", function(){
      let val = this.value.toLowerCase();

      document.querySelectorAll("#tableContainer table tr").forEach((row,i)=>{
        if(i===0) return;
        row.style.display = row.innerText.toLowerCase().includes(val) ? "" : "none";
      });
    });
  }


  // 📄 PAGE SWITCH
  window.showDashboard = function(){
    document.getElementById("dashboard").style.display="block";
    document.getElementById("comparePanel").style.display="none";
  };

  window.showCompare = function(){
    document.getElementById("dashboard").style.display="none";
    document.getElementById("comparePanel").style.display="block";
  };

});


// 🔥 CUSTOM COMPARE
window.runCustomCompare = function(){

  const source1 = document.getElementById("source1").value;
  const source2 = document.getElementById("source2").value;

  let result = [];
  let total=0, match=0, mismatch=0;

  compareData.forEach(item=>{
    let v1 = item[source1] || "";
    let v2 = item[source2] || "";

    let status = (v1 === v2) ? "MATCH" : "MISMATCH";

    if(status==="MATCH") match++;
    else mismatch++;

    total++;

    result.push({
      key: item.key,
      v1,
      v2,
      status
    });
  });

  document.getElementById("compareTotal").innerText = total;
  document.getElementById("compareMatch").innerText = match;
  document.getElementById("compareMismatch").innerText = mismatch;

  renderCompareTable(result, source1, source2);
};


// 🔥 RENDER CUSTOM TABLE
function renderCompareTable(data, s1, s2){
  let html = `<table>
  <tr>
    <th>Key</th>
    <th>${s1}</th>
    <th>${s2}</th>
    <th>Status</th>
  </tr>`;

  data.forEach(item=>{
    let cls = item.status === "MATCH" ? "match" : "mismatch";

    html += `<tr class="${cls}">
      <td>${item.key}</td>
      <td>${item.v1}</td>
      <td>${item.v2}</td>
      <td>${item.status}</td>
    </tr>`;
  });

  html += "</table>";

  document.getElementById("compareResult").innerHTML = html;
}


// 🔍 CUSTOM FILTERS
window.showAllCompare = function(){
  renderCompareTable(compareData);
};

window.showMismatchCompare = function(){
  const filtered = compareData.filter(item => item.status === "MISMATCH");
  renderCompareTable(filtered);
};