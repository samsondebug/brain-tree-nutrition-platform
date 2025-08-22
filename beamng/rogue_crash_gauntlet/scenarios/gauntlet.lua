local M = {}

local modules = {"hammer", "barrels", "pendulum", "spikes"}
local placedModules = {}
local veh
local totalDamage = 0
local maxDamage = 10000 -- tweak per vehicle

local function spawnModule(slot)
    local choice = modules[math.random(#modules)]
    placedModules[slot] = choice
    -- TODO: spawn the hazard objects for the selected module here
end

local function setupModules()
    for slot = 1, 6 do -- six slots around the arena
        spawnModule(slot)
    end
end

local function onTick()
    if not veh then return end
    local damage = veh:getInitialDamage()
    if damage > totalDamage then
        totalDamage = damage
        local survival = math.max(0, 1 - damage / maxDamage) * 100
        guihooks.message(string.format("Survival: %.1f%%", survival), 1)
    end
end

local function onInit()
    veh = scenetree.findObject('player1')
    math.randomseed(os.time())
    setupModules()
end

M.onInit = onInit
M.onTick = onTick
return M
