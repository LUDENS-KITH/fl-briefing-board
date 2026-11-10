-- Relit les définitions d'unités d'un mod DCS sans DCS (lot 21) : chaque fichier listé
-- s'exécute dans un bac à sable où tout nom inconnu est un objet neutre, et où les appels
-- qui déclarent une unité (add_surface_unit, add_aircraft…) gardent la table reçue.
-- Toute table qui porte un `Name` et un `mapclasskey` est écrite : « Name<TAB>clé<TAB>fichier » ;
-- un fichier qui s'arrête en route (gabarit absent hors du jeu) est nommé sur la sortie d'erreur.
-- Lancé par tools/build_mapclass.py avec bin/luae.exe de l'installation ; n'écrit rien.
-- Usage : luae.exe mapclass_probe.lua liste.txt   (un chemin de fichier .lua par ligne)

local P
local function ret() return P end
P = setmetatable({}, {
  __index = ret, __newindex = function() end, __call = ret,
  __add = ret, __sub = ret, __mul = ret, __div = ret, __mod = ret, __pow = ret, __unm = ret,
  __concat = function(a, b) return (type(a) == 'string' and a or '') .. (type(b) == 'string' and b or '') end,
  __len = function() return 0 end,
})

local seen, out, path = {}, {}, nil
local function walk(t, depth)
  if type(t) ~= 'table' or t == P or seen[t] or depth > 6 then return end
  seen[t] = true
  local n, k = rawget(t, 'Name'), rawget(t, 'mapclasskey')
  if type(n) == 'string' and type(k) == 'string' then out[#out + 1] = n .. '\t' .. k .. '\t' .. path end
  for _, v in pairs(t) do walk(v, depth + 1) end
end

local list = assert(io.open(arg[1]))
for line in list:lines() do
  path = line
  local f = loadfile(path)
  if f then
    local caught = {}
    -- les définitions de DCS héritent de leurs gabarits (GT_t.generic_tank…) : ici, tout
    -- champ absent d'une table qui hérite est l'objet neutre, pour que GT.visual.shape = …
    -- ne s'arrête pas sur un gabarit qui n'existe pas hors du jeu
    local inherit = { __index = ret }
    local env = { set_recursive_metatable = function(t) if type(t) == 'table' and t ~= P then setmetatable(t, inherit) end end,
                  setmetatable = function(t, m) if type(t) == 'table' and t ~= P then setmetatable(t, inherit) end return t end }
    setmetatable(env, { __index = function(_, key)
      local g = _G[key]
      if g ~= nil and key ~= 'dofile' and key ~= 'io' and key ~= 'os' and key ~= 'require' and key ~= 'loadfile' then return g end
      if type(key) == 'string' and (key:match('^add_') or key:match('^make_') or key:match('^declare_')) then
        return function(...) for _, a in ipairs({...}) do caught[#caught + 1] = a end return P end
      end
      return P
    end })
    setfenv(f, env)
    local ok, e = pcall(f)
    if not ok then io.stderr:write(path, " : ", tostring(e), string.char(10)) end
    seen = {}
    for _, t in ipairs(caught) do walk(t, 0) end
    for _, v in pairs(env) do walk(v, 0) end
  end
end
list:close()
io.write(table.concat(out, '\n'), '\n')
