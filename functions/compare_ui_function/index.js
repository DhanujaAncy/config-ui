module.exports = async (context, basicIO) => {
  try {
    const dc0 = basicIO.getArgument('dc0');
    const dc1rw = basicIO.getArgument('dc1rw');
    const dc1ro = basicIO.getArgument('dc1ro');

    let map = {};
    function extract(data, label) {
      data.forEach(section => {
        section.details.forEach(d => {
          if (!map[d.key]) map[d.key] = { type: section.type };
          map[d.key][label] = d.value;
        });
      });
    }
    extract(dc0, "dc0");
    extract(dc1rw, "dc1rw");
    extract(dc1ro, "dc1ro");

    let result = [];
    Object.keys(map).forEach(key => {
      let v1 = map[key].dc0 || "";
      let v2 = map[key].dc1rw || "";
      let v3 = map[key].dc1ro || "";
      let status = (v1===v2 && v2===v3) ? "MATCH" : "MISMATCH";
      result.push({ key, type: map[key].type, dc0: v1, dc1rw: v2, dc1ro: v3, status });
    });

    basicIO.write(JSON.stringify(result));
    context.close();
  } catch(e) {
    basicIO.write(JSON.stringify({ error: e.message }));
    context.close();
  }
};
